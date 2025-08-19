import "./cron.js"
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transaction.js";
import userRoutes from "./routes/user.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors({
  origin: [
    "https://trioxtrade-client.vercel.app",
    "https://trioxtrade.com",
    "http://localhost:5173"
  ]
})); // configure orgin to use only frontend for deployment
// REMEMBER TO DO EMAIL VERIFICATION AND PASSWORD RESET

/* ROUTES */
app.use("/auth", authRoutes); // login and register routes
app.use("/transactions", transactionRoutes); // route for adding and fetching transactions
app.use("/user", userRoutes); //route for updating user details


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  }).catch((error) => console.log(`${error} did not connect`));

export default app;