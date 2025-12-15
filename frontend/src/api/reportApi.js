const BASE_URL = "http://localhost:4000/api";

export const uploadCsv = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`${BASE_URL}/reports/upload`, {
        method: "POST",
        body: formData,
    });
    
    if (!res.ok) {
        throw new Error("Upload failed");
    }
    
    return res.json();
};

export const getJobStatus = async (jobId) => {
    const res = await fetch(`${BASE_URL}/job-status/${jobId}`);
    if (!res.ok) {
        throw new Error("Failed to fetch job status");
    }
    return res.json();
};

export const submitReport = async (data) => {
    const res = await fetch(`${BASE_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        throw new Error("Submit failed");
    }
    
    return res.json();
};

export const getDashboardData = async (month) => {
    const res = await fetch(`${BASE_URL}/dashboard?month=${month}`);
    if (!res.ok) {
        throw new Error("Failed to load dashboard");
    }
    return res.json();
};
