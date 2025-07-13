// src/components/Topbar.js
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { usuario } = useAuth();
  const [nombreTienda, setNombreTienda] = useState("");

  useEffect(() => {
    const fetchTienda = async () => {
      if (usuario) {
        const docRef = doc(db, "tiendas", usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNombreTienda(docSnap.data().nombre);
        }
      }
    };
    fetchTienda();
  }, [usuario]);

  return (
    <header style={{
      background: "#f8f9fa",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e0e0e0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>
        🏪 <strong>{nombreTienda}</strong> - Punto de Venta
      </span>

      <button
        onClick={() => signOut(auth)}
        style={{
          background: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          fontSize: "0.95rem",
          cursor: "pointer"
        }}
      >
        🔓 Cerrar sesión
      </button>
    </header>
  );
}


