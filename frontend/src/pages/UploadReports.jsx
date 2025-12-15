import { useState, useEffect } from "react";
import { uploadCsv, getJobStatus } from "../api/reportApi";
import JobStatus from "../components/JobStatus";

export default function UploadReports() {
    const [file, setFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!jobId) return;
        
        const interval = setInterval(async () => {
            try {
                const status = await getJobStatus(jobId);
                setJobStatus(status);
                
                if (status.status === "COMPLETED" || status.status === "FAILED") {
                    clearInterval(interval);
                }
            } catch (err) {
                setError("Failed to fetch job status");
                clearInterval(interval);
            }
        }, 2000);
        
        return () => clearInterval(interval);
    }, [jobId]);
    
    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file");
            return;
        }
        
        try {
            setError(null);
            setJobStatus(null);
            
            const response = await uploadCsv(file);
            setJobId(response.job_id);
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
    <div>
        <h3>Bulk CSV Upload</h3>
        <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
        />
        
        <button onClick={handleUpload} style={{ marginLeft: 10 }}>
            Upload
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {jobId && <JobStatus status={jobStatus} />}
    </div>
);
}
