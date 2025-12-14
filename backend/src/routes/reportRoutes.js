const express = require("express");
const router = express.Router();

const { submitReport } = require("../controllers/reportControllers");
const { validateReportPayload } = require("../middlewares/validateRequest");

router.post("/report", validateReportPayload, submitReport);

module.exports = router;
