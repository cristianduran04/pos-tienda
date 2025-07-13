// src/components/Sidebar.js
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
  { path: "/", label: "🏠 Inicio" },
  { path: "/productos", label: "📦 Productos" },
  { path: "/ventas", label: "🛒 Ventas" },
  { path: "/historial", label: "📊 Historial" },
  { path: "/reabastecimientos", label: "🔄 Reabastecimientos" },
  { path: "/caja", label: "💵 Caja" },
  { path: "/movimientos", label: "📄 Movimientos de Caja" } // Aquí se agregó el ícono

  ];

  return (
    <aside
      style={{
        width: "230px",
        background: "#fff",
        borderRight: "1px solid #e0e0e0",
        padding: "1rem",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h2 style={{
        color: "#007bff",
        fontWeight: "bold",
        fontSize: "1.3rem",
        marginBottom: "2rem",
        textAlign: "center"
      }}>
        
        POS Tienda
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              padding: "10px 12px",
              borderRadius: "8px",
              color: location.pathname === item.path ? "#fff" : "#333",
              backgroundColor: location.pathname === item.path ? "#007bff" : "transparent",
              fontWeight: location.pathname === item.path ? "bold" : "500",
              transition: "all 0.2s ease"
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}



