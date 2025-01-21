import "dotenv/config";
import cors from "cors";
import color from "colors";
import express from "express";
import globalError from "./middlewares/errorMiddleware.js";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoute.js";

connectDB();
const app = express();
// set the view engine to ejs
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));// this is the default anyway

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

//routes
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/main", (req, res) => {
  res.render("main");
});
app.use(globalError);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
