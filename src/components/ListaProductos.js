import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ListaProductos({ setProductoEditando }) {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [productoReabastecer, setProductoReabastecer] = useState(null);
  const [cantidadNueva, setCantidadNueva] = useState("");
  const [costoUnidad, setCostoUnidad] = useState("");

  useEffect(() => {
    if (!usuario) return;
    const ref = collection(db, "tiendas", usuario.uid, "productos");
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProductos(data);
    });
    return unsub;
  }, [usuario]);

  const eliminarProducto = async (id) => {
    if (!usuario) return;
    const ref = doc(db, "tiendas", usuario.uid, "productos", id);
    await deleteDoc(ref);
  };

  const confirmarReabastecimiento = async () => {
    if (!usuario || !productoReabastecer) return;
    const nuevaCantidad = parseInt(cantidadNueva);
    const costo = parseFloat(costoUnidad);
    if (isNaN(nuevaCantidad) || isNaN(costo)) {
      alert("Cantidad o costo inválido");
      return;
    }

    try {
      const refProd = doc(db, "tiendas", usuario.uid, "productos", productoReabastecer.id);
      const nuevoStock = (productoReabastecer.stock || 0) + nuevaCantidad;

      await updateDoc(refProd, { stock: nuevoStock });

      const refReab = collection(refProd, "reabastecimientos");
      await addDoc(refReab, {
        cantidad: nuevaCantidad,
        costoUnidad: costo,
        fecha: new Date()
      });

      alert("Reabastecimiento registrado");
      setProductoReabastecer(null);
      setCantidadNueva("");
      setCostoUnidad("");
    } catch (e) {
      console.error("Error reabasteciendo:", e);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "#007bff", marginBottom: "1rem" }}>📋 Lista de productos</h3>

      <div style={{
        maxHeight: "400px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "800px"
        }}>
          <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
            <tr>
              <th style={th}>Nombre</th>
              <th style={th}>Compra</th>
              <th style={th}>Venta</th>
              <th style={th}>Ganancia</th>
              <th style={th}>Stock</th>
              <th style={th}>Medida</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const ganancia = (p.precioVenta || 0) - (p.precioCompra || 0);
              return (
                <tr key={p.id}>
                  <td style={td}>{p.nombre}</td>
                  <td style={td}>${p.precioCompra}</td>
                  <td style={td}>${p.precioVenta}</td>
                  <td style={td}>${ganancia.toFixed(2)}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>{p.medida}</td>
                  <td style={td}>
                    <button style={btnEdit} onClick={() => setProductoEditando(p)}>✏️</button>
                    <button style={btnDelete} onClick={() => eliminarProducto(p.id)}>🗑️</button>
                    <button style={btnReabastecer} onClick={() => setProductoReabastecer(p)}>📦</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {productoReabastecer && (
        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9"
        }}>
          <h4>📦 Reabastecer: {productoReabastecer.nombre}</h4>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="number"
              placeholder="Cantidad nueva"
              value={cantidadNueva}
              onChange={(e) => setCantidadNueva(e.target.value)}
              required
              style={input}
            />
            <input
              type="number"
              placeholder="Costo por unidad"
              value={costoUnidad}
              onChange={(e) => setCostoUnidad(e.target.value)}
              required
              style={input}
            />
          </div>
          <button style={btnPrimary} onClick={confirmarReabastecimiento}>💾 Guardar</button>
          <button onClick={() => setProductoReabastecer(null)} style={btnCancel}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// Estilos reutilizables
const th = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
  borderBottom: "1px solid #ccc"
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

const btnEdit = {
  backgroundColor: "#ffc107",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  marginRight: "5px",
  cursor: "pointer"
};

const btnDelete = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  marginRight: "5px",
  cursor: "pointer"
};

const btnReabastecer = {
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer"
};

const input = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  flex: 1
};

const btnPrimary = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "1rem"
};

const btnCancel = {
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer"
};




