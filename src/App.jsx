import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import CreateFuneral from "./Pages/CreateFuneral";
import ManageFunerals from "./Pages/ManageFunerals";
import DonationsView from "./Pages/DonationsView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-funeral" element={<CreateFuneral />} />
        <Route path="/manage-funerals" element={<ManageFunerals />} />
        <Route path="/donations" element={<DonationsView />} />
      </Routes>
    </Router>
  );
}

export default App;
