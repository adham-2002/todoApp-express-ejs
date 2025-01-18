import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const URI = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    ).replace("<DATABASE_NAME>", process.env.DATABASE_NAME);
    await mongoose.connect(URI);
    console.log("Database connected 🥳".blue.bold);
  } catch (error) {
    // error red with color package
    console.log(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};
export default connectDB;
