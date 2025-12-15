import { useState } from "react";
import { getDashboardData } from "../api/reportApi";

export default function Dashboard() {
    const [month, setMonth] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleFetch = async () => {
        if (!month) {
            setError("Please select a month");
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const response = await getDashboardData(month);
            setData(response);
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };
    
    return (
    <div>
        <h3>Admin Dashboard</h3>
        
        <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
        />
        <button
            onClick={handleFetch}
            disabled={loading}
            style={{ marginLeft: 10 }}
        >
            Load
        </button>
        
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {data && (
            <div style={{ marginTop: 15 }}>
                <p><strong>Total NGOs Reporting:</strong> {data.total_ngos_reporting}</p>
                <p><strong>Total People Helped:</strong> {data.total_people_helped}</p>
                <p><strong>Total Events Conducted:</strong> {data.total_events_conducted}</p>
                <p><strong>Total Funds Utilized:</strong> {data.total_funds_utilized}</p>
            </div>
        )}
    </div>
    );
}
