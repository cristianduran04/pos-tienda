import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";


function RutasProtegidas({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/*"
          element={
            <RutasProtegidas>
              <Dashboard />
            </RutasProtegidas>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

