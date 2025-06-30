require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const taskroutes= require("./routes/taskroutes");
const reportRoutes = require("./routes/reportroutes");


const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks",taskroutes)
app.use("/api/tasks",reportRoutes);


app.get("/api/auth/test", (req, res) => res.json({ msg: "Route works!" }));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 App is running at http://localhost:${port}`);
});
