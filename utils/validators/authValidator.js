import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
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
    .bail(),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({
      min: 6,
    })
    .withMessage("Password must be at least 6 characters long"),

  validatorMiddleware,
];
export const forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail(),
  validatorMiddleware,
];
export const verifyPasswordValidator = [
  check("resetCode").notEmpty().withMessage("Reset Code is required").bail(),
  validatorMiddleware,
];
export const resetPasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
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
];

//or you can use this export statment
// export { signupValidator, signinValidator, forgetPasswordValidator };
