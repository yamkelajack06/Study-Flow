import { BrowserRouter as Router,Routes,Route,Navigate,} from "react-router-dom";
import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import LandingPage from "./pages/Authentication/LandingPage";
import HomePage from "./pages/Main/HomePage";
import { ui } from "./services/firebase_auth";
import MySignInPage from "./pages/Authentication/SignUp";

const App = () => {
  return (
    <FirebaseUIProvider ui={ui}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<HomePage />} />
          <Route path="/signup" element={<MySignInPage />} />
        </Routes>
      </Router>
    </FirebaseUIProvider>
  );
};

export default App;
