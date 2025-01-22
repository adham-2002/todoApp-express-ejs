import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import {
  generateResetCode,
  hashCode,
  saveResetCodeToUser,
} from "../utils/passwordResetUtils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import apiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";

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
    slug,
  });

  // 2- Generate Token
  const token = createToken({ id: user._id });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
    token,
  });
});
//! @desc SignIn
// @Route POST /api/v1/auth/signin
// @access Public
export const signin = asyncHandler(async (req, res) => {
  //1) check if email exists and password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Invalid email or password", 401));
  }
  if (!user.active) {
    return next(new apiError("User is not active", 401));
  }

  const token = createToken({ id: user._id });
  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: user,
    token,
  });
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
  console.log(resetCode);

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
  const token = createToken({ id: user._id });
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
    token,
  });
});
