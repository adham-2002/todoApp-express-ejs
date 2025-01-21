import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createTaskValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("dueDate")
    .notEmpty()
    .withMessage("Due Date is required")
    .isDate()
    .withMessage("Due Date must be a valid date")
    .custom((value, { req }) => {
      const today = new Date();
      if (value < today) {
        throw new Error("Due Date cannot be in the past");
      }
      return true;
    }),
  check("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),

  validatorMiddleware,
];
