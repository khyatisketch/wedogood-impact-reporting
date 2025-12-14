const reportService = require("../services/reportService");
const HttpStatusCodes = require("../utils/httpStatusCodes");
const asyncHandler = require("../middlewares/asyncHandler");

const submitReport = asyncHandler(async (req, res) => {
    const report = await reportService.createReport(req.body);
    
    res.status(HttpStatusCodes.CREATED).json({
        message: "Report submitted successfully",
        report,
    });
});

module.exports = { submitReport };
