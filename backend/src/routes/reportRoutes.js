const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const { getJobStatus, submitReport, uploadReports } = require("../controllers/reportControllers");
const { validateReportPayload } = require("../middlewares/validateRequest");

router.post("/report", validateReportPayload, submitReport);
router.post(
    "/reports/upload",
    upload.single("file"),
    uploadReports
);

router.get("/job-status/:job_id", getJobStatus);

module.exports = router;
