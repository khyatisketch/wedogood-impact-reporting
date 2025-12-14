const asyncHandler = require("../middlewares/asyncHandler");
const HttpStatusCodes = require("../utils/httpStatusCodes");
const reportService = require("../services/reportService");

const getJobStatus = asyncHandler(async (req, res) => {
    const { job_id } = req.params;
    
    const jobStatus = await reportService.getJobStatus(job_id);
    
    res.status(HttpStatusCodes.OK).json(jobStatus);
});

const submitReport = asyncHandler(async (req, res) => {
    const report = await reportService.createReport(req.body);
    
    res.status(HttpStatusCodes.CREATED).json({
        message: "Report submitted successfully",
        report,
    });
});

const uploadReports = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "CSV file is required",
        });
    }
    
    const job = await reportService.createUploadJob();
    
    reportService.processCsvInBackground(job.job_id, req.file.buffer);
    
    res.status(HttpStatusCodes.CREATED).json({
        message: "Upload job started",
        job_id: job.job_id,
    });
});

module.exports = {
    getJobStatus,
    submitReport,
    uploadReports,
};
