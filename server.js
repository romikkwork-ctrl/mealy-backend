const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Waitlist = require("./models/Waitlist");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Mealy backend running with MongoDB");
});

app.post("/api/waitlist", async (req, res) => {
  try {
    const { name, email, device } = req.body;

    if (!name || !email || !device) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Waitlist.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    await Waitlist.create({ name, email, device });

    res.json({ message: "Added to waitlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
