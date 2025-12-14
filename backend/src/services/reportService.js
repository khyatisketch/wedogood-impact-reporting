const pool = require("../db");
const HttpStatusCodes = require("../utils/httpStatusCodes");

const createReport = async ({
    ngo_id,
    month,
    people_helped,
    events_conducted,
    funds_utilized,
}) => {
    try {
        const result = await pool.query(
            `
            INSERT INTO reports
            (ngo_id, month, people_helped, events_conducted, funds_utilized)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `,
            [ngo_id, month, people_helped, events_conducted, funds_utilized]
        );
        
        return result.rows[0];
    } catch (err) {
        if (err.code === "23505") {
            const error = new Error(
                "Report for this NGO and month already exists"
            );
            error.statusCode = HttpStatusCodes.CONFLICT;
            throw error;
        }
        
        throw err;
    }
};

module.exports = {
    createReport,
};
