import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import refreshTokenModel from "../models/refreshTokenModel.js";
import {
  generateResetCode,
  hashCode,
  saveResetCodeToUser,
} from "../utils/passwordResetUtils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import apiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtUtils.js";

//! @desc SignUp
// @route POST /api/v1/auth/signup
// @access Public

export const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password, confirmPassword, slug } = req.body;
  // 1- check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new apiError("User already exists", 400));
  }

  const user = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: {
      username: user.username,
      email: user.email,
      slug: user.slug,
    },
  });
});
//! @desc SignIn
// @ Route POST /api/v1/auth/signin
// @ access Public
export const signin = asyncHandler(async (req, res, next) => {
  // 1) Check if email exists and password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Invalid email or password", 401));
  }

  if (!user.active) {
    return next(new apiError("User is not active", 401));
  }

  // 2) Generate access token and refresh token
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // 3) Delete the old refresh token if it exists
  await refreshTokenModel.deleteOne({ userId: user._id });

  // 4) Save the new refresh token with an expiration time
  const expiresAt = new Date(
    Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
  );
  await refreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    expiresAt,
  });

  // 5) Send the refresh token as an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN), // Expires in the duration you set
  });

  // 6) Send the response with the access token and user data
  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: user,
    accessToken,
  });
});

//! @desc Logout
// @ Route POST /api/v1/auth/logout
// @
export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    return next(new apiError("Refresh token not provided", 400));
  }

  // Delete the refresh token from the database
  await refreshTokenModel.findOneAndDelete({ token });

  // Clear the refresh token cookie
  res.clearCookie("refreshToken");

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
//! @desc Refresh Token
//!
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new apiError("Not authorized to access this route", 401));
  }

  // Find the refresh token in the database
  const existingToken = await refreshTokenModel.findOne({
    token: refreshToken,
  });
  if (!existingToken) {
    return next(new apiError("Invalid refresh token", 401));
  }

  // Verify the token
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        return next(new apiError("Not authorized to access this route", 401));
      }

      const userId = decoded.id;

      // Generate new tokens
      const newAccessToken = generateAccessToken({ id: userId });
      const newRefreshToken = generateRefreshToken({ id: userId });
      console.log(newRefreshToken);
      // Update the refresh token in the database
      const expiresAt = new Date(
        Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
      ); // 7 days
      existingToken.token = newRefreshToken;
      existingToken.expiresAt = expiresAt;
      await existingToken.save();

      // Send the new refresh token as a cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN),
      });

      res.status(200).json({
        status: "success",
        accessToken: newAccessToken,
      });
    }
  );
});

//! @desc Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token is exists if exists hold it in a variable
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new apiError("Not authorized to access this route", 401));
  }
  // 2) verify token ( no changes happen or expired)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new apiError("User no longer exists", 401));
  }
  //4) check if user is active
  if (!currentUser.active) {
    return next(new apiError("User is not active", 401));
  }
  req.user = currentUser;
  next();
});
//! @desc Restrict to specific roles
export const allowedTo = (...roles) => {
  return (req, res, next) => {
    // 1) check if user role is allowed to access this route
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError(
          `User role ${req.user.role} is not allowed to access this route`,
          403
        )
      );
    }
    next();
  };
};
//! @desc Forget Password
// @Route POST /api/v1/auth/forget-password
// @access Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new apiError(`There is no user with this email ${req.body.email}`, 404)
    );
  }

  // generate reset code
  const resetCode = generateResetCode();
  // console.log(resetCode);

  // hash reset code
  const hashedCode = hashCode(resetCode);

  // save reset code to user
  await saveResetCodeToUser(user, hashedCode);

  // send email with reset code
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message: `hi ${user.username}, your reset code is ${resetCode}`,
    });
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (err) {
    // handle if there is an error while sending email
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new apiError("Error sending email", 500));
  }
});
//! @desc Verify Password Reset Code
// @Route POST /api/v1/auth/verifyResetCode
// @access Public
export const verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // get user based on reset code
  const hashedCode = hashCode(req.body.resetCode);
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetExpires: { $gt: Date.now() },
    passwordResetVerified: false,
  });
  if (!user) {
    return next(new apiError("Invalid reset code", 404));
  }
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code verified successfully",
  });
});
//! @desc Reset Password
// @Route POST /api/v1/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  // check if user exists
  if (!user) {
    return next(new apiError("User not found", 404));
  }

  // check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new apiError("Reset code not verified", 404));
  }

  // check if reset code is expired
  if (user.passwordResetExpires < Date.now()) {
    return next(new apiError("Reset code expired", 404));
  }
  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  const token = generateAccessToken({ id: user._id });
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });
});
