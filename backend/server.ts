import express from "express";
import emailRoutes from "./routes/emailRoute";
import authRoutes from "./routes/authRoute";
import cors from "cors";

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/emails", emailRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
