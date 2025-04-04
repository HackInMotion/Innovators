import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoute from "./pages/ClientRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<ClientRoute />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
