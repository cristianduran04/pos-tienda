import { useEffect, useState } from "react";
import { collectionGroup, query, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ListaReabastecimientos() {
  const { usuario } = useAuth();
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    if (!usuario) return;

    const q = query(collectionGroup(db, "reabastecimientos"));
    const unsub = onSnapshot(q, async (snap) => {
      const datos = await Promise.all(snap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const productoRef = docSnap.ref.parent.parent;
        const productoSnap = await getDoc(productoRef);
        const producto = productoSnap.data();
        return {
          id: docSnap.id,
          ...data,
          fecha: data.fecha?.toDate?.() || new Date(),
          nombreProducto: producto?.nombre || "Producto desconocido"
        };
      }));
      setRegistros(datos);
    });

    return unsub;
  }, [usuario]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ color: "#6f42c1", marginBottom: "1rem" }}>📦 Historial de Reabastecimientos</h2>

      <div style={{
        maxHeight: "400px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.95rem"
        }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th style={th}>Producto</th>
              <th style={th}>Fecha</th>
              <th style={th}>Cantidad</th>
              <th style={th}>Costo Unitario</th>
              <th style={th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.nombreProducto}</td>
                <td style={td}>{r.fecha.toLocaleString()}</td>
                <td style={td}>{r.cantidad}</td>
                <td style={td}>${r.costoUnidad}</td>
                <td style={td}>${(r.cantidad * r.costoUnidad).toFixed(2)}</td>
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
  borderBottom: "2px solid #dee2e6"
};

const td = {
  padding: "8px 10px",
  borderBottom: "1px solid #f1f1f1"
};

