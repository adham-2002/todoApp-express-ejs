import slugify from "slugify";
import { check } from "express-validator";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../middlewares/validatorMiddleware.js";
export const signupValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({
      min: 3,
    })
    .withMessage("Username must be at least 3 characters long")
    .isLength({
      max: 20,
    })
    .withMessage("Username must be at most 20 characters long")
    .matches(/[a-zA-Z]/)
    .withMessage("The field must contain at least one letter."),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  // .custom(async (email) => {
  //   const user = await User.findOne({ email });
  //   if (user) {
  //     throw new Error("Email already in use");
  //   }
  // }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character.")
    .custom(async (password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isLength({
      min: 6,
    }),
  validatorMiddleware,
];
export const signinValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return Promise.reject();
      }
      if (!user.active) {
        throw new Error("Your account is not active");
      }
      req.user = user; // Attach the user to the request object
      return true;
    }),

  check("password")
    .custom((password, { req }) => {
      // Skip validation if email validation has failed
      if (!req.user) {
        throw new Error("Invalid email or password");
      }
      return true;
    })
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters long")
    .bail()
    .custom(async (password, { req }) => {
      if (!(await bcrypt.compare(password, req.user.password))) {
        throw new Error("Invalid email or password");
      }
    }),

  validatorMiddleware,
];
