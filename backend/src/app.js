require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ status: "OK", db: "connected" });
    } catch (err) {
        res.status(500).json({ status: "ERROR", db: "not connected" });
    }
});

app.use("/api", dashboardRoutes);
app.use("/api", reportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
