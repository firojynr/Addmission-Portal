import Home from "./pages/Home";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ApplicationForm from "./components/ApplicationForm";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/application-form"
        element={
          <ProtectedRoute>
            <ApplicationForm />
          </ProtectedRoute>
        }
      />
      {/* Other routes */}
    </Routes>
  );
}

export default App;
