const pool = require("../db");
const HttpStatusCodes = require("../utils/httpStatusCodes");
const { parseCsvBuffer } = require("../utils/csvParser");

const { v4: uuidv4 } = require("uuid");

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

const createUploadJob = async () => {
    const jobId = uuidv4();
    
    await pool.query(
        `
        INSERT INTO jobs (job_id, status, total_rows, processed_rows, failed_rows)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [jobId, "PENDING", 0, 0, 0]
    );
    
    return { job_id: jobId };
};

const getJobStatus = async (jobId) => {
    const result = await pool.query(
        `
        SELECT
        job_id,
        status,
        total_rows,
        processed_rows,
        failed_rows,
        created_at
        FROM jobs
        WHERE job_id = $1
        `,
        [jobId]
    );
    
    if (result.rows.length === 0) {
        const error = new Error("Job not found");
        error.statusCode = HttpStatusCodes.NOT_FOUND;
        throw error;
    }
    
    return result.rows[0];
};

const isValidNumber = (value) =>
    typeof value === "number" && !Number.isNaN(value);

const processCsvInBackground = async (jobId, buffer) => {
    try {
        const rows = await parseCsvBuffer(buffer);
        
        await pool.query(
            `
            UPDATE jobs
            SET total_rows = $1, status = 'PROCESSING'
            WHERE job_id = $2
            `,
            [rows.length, jobId]
    );

    let processed = 0;
    let failed = 0;

    for (const row of rows) {
        const peopleHelped = Number(row.people_helped);
        const eventsConducted = Number(row.events_conducted);
        const fundsUtilized = Number(row.funds_utilized);
        
        if (
            !row.ngo_id ||
            !row.month ||
            !isValidNumber(peopleHelped) ||
            !isValidNumber(eventsConducted) ||
            !isValidNumber(fundsUtilized)
        ) {
            failed++;
        } else {
            try {
                await createReport({
                    ngo_id: row.ngo_id,
                    month: row.month,
                    people_helped: peopleHelped,
                    events_conducted: eventsConducted,
                    funds_utilized: fundsUtilized,
                });
                processed++;
            } catch (err) {
                failed++;
            }
        }
        
        await pool.query(
            `
            UPDATE jobs
            SET processed_rows = $1, failed_rows = $2
            WHERE job_id = $3
            `,
            [processed, failed, jobId]
        );
}
    
    await pool.query(
        `
        UPDATE jobs
        SET status = 'COMPLETED'
        WHERE job_id = $1
        `,
        [jobId]
    );
} catch (err) {
    await pool.query(
        `
        UPDATE jobs
        SET status = 'FAILED'
        WHERE job_id = $1
        `,
        [jobId]
    );
}
};

module.exports = {
    createReport,
    createUploadJob,
    getJobStatus,
    processCsvInBackground,
};
