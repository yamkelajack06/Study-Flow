import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PersistenceProvider } from "./context/PersistenceContext";
import LandingPage from "./pages/Authentication/LandingPage";
import HomePage from "./pages/Main/HomePage";
import SignInPage from "./pages/Authentication/SignIn";
import MySignInPage from "./pages/Authentication/SignUp";

const App = () => {
  return (
    <AuthProvider>
      <PersistenceProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<HomePage />} />
            <Route path="/signup" element={<MySignInPage />} />
            <Route path="*" element={<SignInPage />} />
          </Routes>
        </Router>
      </PersistenceProvider>
    </AuthProvider>
  );
};

export default App;