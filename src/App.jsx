import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import CreateFuneral from "./Pages/CreateFuneral";
import ManageFunerals from "./Pages/ManageFunerals";
import DonationsView from "./Pages/DonationsView";
import ManageAdmins from "./Pages/ManageAdmins";
import EditFuneral from "./Pages/EditFuneral";
import CreateFuneralAdmin from "./Pages/CreateFuneralAdmin";
import ViewFuneralDetail from "./Pages/ViewFuneralDetail";
import Logs from "./Pages/Logs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-funeral" element={<CreateFuneral />} />
        <Route path="/create-funeral-admin" element={<CreateFuneralAdmin />} />
        <Route path="/manage-funerals" element={<ManageFunerals />} />
        <Route path="/manage-admins" element={<ManageAdmins />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/donations" element={<DonationsView />} />
        <Route path="/edit-funeral/:id" element={<EditFuneral />} />
        <Route path="/view-funeral/:id" element={<ViewFuneralDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
