import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import WelcomePage from "./components/WelcomePage";
import { AuthContextProvider } from "./store/auth-context";
import NotFound from "./components/NotFound";

function App() {
  return (
    <AuthContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthContextProvider>
  );
}

export default App;
