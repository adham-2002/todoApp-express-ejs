import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    taskType: {
      type: String,
      enum: ["Personal", "Group"],
      default: "task",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      optional: true,
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      optional: true,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
taskSchema.pre("save", function (next) {
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? Date.now() : null;
  }
  next();
});
export default mongoose.model("Task", taskSchema);
