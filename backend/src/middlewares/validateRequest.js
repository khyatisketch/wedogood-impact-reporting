const validateReportPayload = (req, res, next) => {
    const { ngo_id, month } = req.body;
    
    if (!ngo_id || !month) {
        return res.status(400).json({
            error: "ngo_id and month are required",
        });
    }
    next();
};

module.exports = { validateReportPayload };
