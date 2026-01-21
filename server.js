const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Waitlist = require("./models/Waitlist");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   MongoDB connection
============================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

/* ============================
   Health check
============================ */
app.get("/", (req, res) => {
  res.send("Mealy backend running");
});

/* ============================
   WAITLIST ROUTE
============================ */
app.post("/api/waitlist", async (req, res) => {
  try {
    const { name, email, device } = req.body;

    console.log("Incoming waitlist request:", { name, email, device });

    if (!name || !email || !device) {
      console.log("Validation failed: missing fields");
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await Waitlist.findOne({ email });

    if (existingUser) {
      console.log("Duplicate email attempt:", email);
      return res.status(409).json({ message: "Email already registered" });
    }

    const savedUser = await Waitlist.create({
      name,
      email,
      device
    });

    console.log("Waitlist entry saved with ID:", savedUser._id.toString());

    res.status(201).json({
      message: "Added to waitlist successfully"
    });
  } catch (error) {
    console.error("Error saving waitlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   Server start
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
