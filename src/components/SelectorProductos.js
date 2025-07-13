import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function SelectorProductos({ carrito, setCarrito }) {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (!usuario) return;
    const ref = collection(db, "tiendas", usuario.uid, "productos");
    const unsub = onSnapshot(ref, snap => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    });
    return unsub;
  }, [usuario]);

  const agregarProducto = (producto) => {
    const yaEnCarrito = carrito.find(p => p.id === producto.id);
    if (yaEnCarrito) {
      setCarrito(carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    } else {
      setCarrito([
        ...carrito,
        {
          ...producto,
          precio: producto.precioVenta,
          precioCompra: producto.precioCompra,
          cantidad: 1
        }
      ]);
    }
  };

  // 🔍 Filtrar productos por nombre (insensible a mayúsculas)
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h3 style={{ color: "#007bff", marginBottom: "0.5rem" }}>🛒 Seleccionar Productos</h3>

      {/* 🔍 Input de búsqueda */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}
      />

      {/* Cuadro scrollable de productos */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          background: "#f9f9f9"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {productosFiltrados.map(p => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                width: "180px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}
            >
              <h4 style={{ marginBottom: "0.3rem" }}>{p.nombre}</h4>
              <p style={small}>📏 {p.medida}</p>
              <p style={small}>💲 Precio: ${p.precioVenta}</p>
              <p style={small}>📦 Stock: {p.stock}</p>
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  width: "100%"
                }}
                onClick={() => agregarProducto(p)}
                disabled={p.stock <= 0}
              >
                ➕ Agregar
              </button>
            </div>
          ))}

          {productosFiltrados.length === 0 && (
            <p style={{ width: "100%", textAlign: "center", color: "#999" }}>
              No se encontraron productos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const small = {
  margin: "0.2rem 0",
  fontSize: "14px",
  color: "#555"
};





