import { useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ListaVentas({ ventas, setVentas }) {
  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario) return;
    const ref = collection(db, "tiendas", usuario.uid, "ventas");
    const q = query(ref, orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        fecha: doc.data().fecha?.toDate?.() || new Date()
      }));
      setVentas(data);
    });
    return unsub;
  }, [usuario, setVentas]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ color: "#007bff" }}>📋 Historial de Ventas</h3>
      <div style={{
        maxHeight: "340px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={th}>🕒 Fecha</th>
              <th style={th}>💵 Total</th>
              <th style={th}>🛍️ Productos</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{v.fecha.toLocaleString()}</td>
                <td style={td}>${v.total?.toFixed(2)}</td>
                <td style={td}>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    {v.productos.map(p => (
                      <li key={p.id}>{p.nombre} x {p.cantidad}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ccc"
};

const td = {
  padding: "8px",
  verticalAlign: "top"
};


