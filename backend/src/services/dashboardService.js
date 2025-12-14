const pool = require("../db");

const getDashboardByMonth = async (month) => {
    const query = `
    SELECT
        COUNT(DISTINCT ngo_id) AS total_ngos_reporting,
        COALESCE(SUM(people_helped), 0) AS total_people_helped,
        COALESCE(SUM(events_conducted), 0) AS total_events_conducted,
        COALESCE(SUM(funds_utilized), 0) AS total_funds_utilized
    FROM reports
    WHERE month = $1;
`;

const result = await pool.query(query, [month]);

return {
    month,
    total_ngos_reporting: Number(result.rows[0].total_ngos_reporting),
    total_people_helped: Number(result.rows[0].total_people_helped),
    total_events_conducted: Number(result.rows[0].total_events_conducted),
    total_funds_utilized: Number(result.rows[0].total_funds_utilized),
};
};

module.exports = { getDashboardByMonth };
