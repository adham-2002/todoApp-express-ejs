import mongoose from "mongoose";

const taskAssignmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});
export default mongoose.model("TaskAssignment", taskAssignmentSchema);
