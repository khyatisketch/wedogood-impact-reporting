require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({ status: "OK", db: "connected" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "ERROR", db: "not connected" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
