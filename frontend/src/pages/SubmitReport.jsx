import { useState } from "react";
import { submitReport } from "../api/reportApi";

export default function SubmitReport() {
    const [form, setForm] = useState({
        ngo_id: "",
        month: "",
        people_helped: "",
        events_conducted: "",
        funds_utilized: "",
    });
    
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        
        try {
            await submitReport({
                ...form,
                people_helped: Number(form.people_helped),
                events_conducted: Number(form.events_conducted),
                funds_utilized: Number(form.funds_utilized),
            });
            
            setMessage("Report submitted successfully");
            setForm({
                ngo_id: "",
                month: "",
                people_helped: "",
                events_conducted: "",
                funds_utilized: "",
            });
        } catch (err) {
            setError(err.message || "Submission failed");
        }
    };
    
    return (
    <div>
        <h3>Submit Single Report</h3>
        
        <form onSubmit={handleSubmit}>
            <input
            name="ngo_id"
            placeholder="NGO ID"
            value={form.ngo_id}
            onChange={handleChange}
            required
        />
        
        <input
            name="month"
            placeholder="YYYY-MM"
            value={form.month}
            onChange={handleChange}
            required
        />
        
        <input
            name="people_helped"
            type="number"
            placeholder="People Helped"
            value={form.people_helped}
            onChange={handleChange}
        />

        <input
            name="events_conducted"
            type="number"
            placeholder="Events Conducted"
            value={form.events_conducted}
            onChange={handleChange}
        />

        <input
            name="funds_utilized"
            type="number"
            placeholder="Funds Utilized"
            value={form.funds_utilized}
            onChange={handleChange}
        />
        
        <button type="submit">Submit</button>
        </form>
        
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    );
}
