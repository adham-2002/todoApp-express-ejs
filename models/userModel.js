import mongoose from "mongoose";
import bcrypt from "bcrypt";
import slugify from "slugify";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordResetCode: { type: String },
    passwordResetExpires: { type: Date },
    passwordResetVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// encrypt password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// add slug to the schema
userSchema.pre("save", function (next) {
  this.slug = slugify(this.username, {
    lower: true,
    strict: true,
  });
  next();
});
export default mongoose.model("User", userSchema);
