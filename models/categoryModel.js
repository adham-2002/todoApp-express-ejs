import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["predefined", "user-defined"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Only used for user-defined categories
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.index({ type: 1, userId: 1 }); // Optimized indexing for queries
export default mongoose.model("Category", categorySchema);
