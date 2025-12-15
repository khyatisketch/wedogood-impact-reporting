import UploadReports from "./pages/UploadReports";
import SubmitReport from "./pages/SubmitReport";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>WeDoGood Impact Reporting</h2>
      <UploadReports />
      <hr />
      <SubmitReport />
      <hr />
      <Dashboard />
    </div>
  );
}

export default App;
