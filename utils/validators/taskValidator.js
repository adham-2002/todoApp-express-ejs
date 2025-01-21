import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createTaskValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("dueDate")
    .notEmpty()
    .withMessage("Due Date is required")
    .isDate()
    .withMessage("Due Date must be a valid date")
    // check if due date is in the future
    .custom((value) => {
      const today = new Date();
      const dueDate = new Date(value);
      if (dueDate < today) {
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

export const updateTaskValidator = [
  check("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID"),
  validatorMiddleware,
];
export const deleteTaskValidator = [
  check("id")
    .notEmpty()
    .withMessage("Task ID is required")
    .isMongoId()
    .withMessage("Invalid Task ID"),
  validatorMiddleware,
];
