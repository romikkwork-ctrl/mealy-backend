const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mealy backend is running");
});

const FILE_PATH = "./waitlist.xlsx";

app.post("/api/waitlist", (req, res) => {
  try {
    const { name, email, device } = req.body;

    if (!name || !email || !device) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const FILE_PATH = "./waitlist.xlsx";
    let workbook;
    let worksheet;
    let data = [];

    if (fs.existsSync(FILE_PATH)) {
      workbook = XLSX.readFile(FILE_PATH);
      worksheet = workbook.Sheets["Waitlist"];
      data = worksheet ? XLSX.utils.sheet_to_json(worksheet) : [];
    } else {
      workbook = XLSX.utils.book_new();
    }

    data.push({
      Name: name,
      Email: email,
      Device: device,
      Date: new Date().toLocaleString()
    });

    const newWorksheet = XLSX.utils.json_to_sheet(data);

    // IMPORTANT: Replace sheet instead of appending again
    workbook.Sheets["Waitlist"] = newWorksheet;

    if (!workbook.SheetNames.includes("Waitlist")) {
      workbook.SheetNames.push("Waitlist");
    }

    XLSX.writeFile(workbook, FILE_PATH);

    res.json({ message: "Successfully added to waitlist" });
  } catch (error) {
    console.error("Excel write error:", error);
    res.status(500).json({ message: "Failed to save data" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
