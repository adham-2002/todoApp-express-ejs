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
      default: "Personal",
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      validate: {
        validator: function (v) {
          return this.taskType === "Group" ? v !== null : true;
        },
        message: "Group is required for Group task",
      },
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// Toggle completedAt
taskSchema.pre("save", function (next) {
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? Date.now() : null;
  }
  next();
});
taskSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.completed !== undefined) {
    update.completedAt = update.completed ? Date.now() : null;
  }

  next();
});

// check if taskType Group has group field
// check if taskType Personal has no group field
taskSchema.pre("save", function (next) {
  if (this.taskType === "Group" && !this.group) {
    next(new Error("Group is required for Group task"));
  } else if (this.taskType === "Personal" && this.group) {
    next(new Error("Group is not required for Personal task"));
  } else {
    next();
  }
});
export default mongoose.model("Task", taskSchema);
