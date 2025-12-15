export default function JobStatus({ status }) {
    if (!status) {
        return <p>Starting job...</p>;
    }
    
    return (
    <div style={{ marginTop: 10 }}>
        <p><strong>Status:</strong> {status.status}</p>
        <p><strong>Total Rows:</strong> {status.total_rows}</p>
        <p><strong>Processed:</strong> {status.processed_rows}</p>
        <p><strong>Failed:</strong> {status.failed_rows}</p>
    </div>
    );
}
