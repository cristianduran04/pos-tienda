// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setUsuario(user));
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario }}>
      {children}
    </AuthContext.Provider>
  );
};
