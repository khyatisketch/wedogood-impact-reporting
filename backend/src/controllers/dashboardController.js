const asyncHandler = require("../middlewares/asyncHandler");
const dashboardService = require("../services/dashboardService");
const HttpStatusCodes = require("../utils/httpStatusCodes");

const getDashboard = asyncHandler(async (req, res) => {
    const { month } = req.query;
    
    if (!month) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "month query parameter is required (YYYY-MM)",
        });
    }
    
    const dashboardData = await dashboardService.getDashboardByMonth(month);
    
    res.status(HttpStatusCodes.OK).json(dashboardData);
});

module.exports = { getDashboard };
