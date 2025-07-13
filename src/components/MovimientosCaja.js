import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function MovimientosCaja() {
  const { usuario } = useAuth();
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCajas = async () => {
      if (!usuario) return;
      const refCajas = collection(db, "tiendas", usuario.uid, "cajas");
      const q = query(refCajas, orderBy("apertura", "desc"));
      const snap = await getDocs(q);
      const listaCajas = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCajas(listaCajas);
      if (listaCajas.length > 0) {
        setCajaSeleccionada(listaCajas[0].id);
      }
      setCargando(false);
    };

    cargarCajas();
  }, [usuario]);

  useEffect(() => {
    const cargarMovimientos = async () => {
      if (!usuario || !cajaSeleccionada) return;
      const ref = collection(
        db,
        "tiendas",
        usuario.uid,
        "cajas",
        cajaSeleccionada,
        "movimientos"
      );
      const q = query(ref, orderBy("fecha", "desc"));
      const snap = await getDocs(q);
      const lista = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(m => m.manual); // Solo manuales
      setMovimientos(lista);
    };

    cargarMovimientos();
  }, [usuario, cajaSeleccionada]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#007bff", marginBottom: "1rem" }}>📋 Movimientos de Caja</h2>

      {cajas.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="caja">Seleccionar Caja: </label>
          <select
            id="caja"
            value={cajaSeleccionada}
            onChange={(e) => setCajaSeleccionada(e.target.value)}
          >
            {cajas.map((caja) => (
              <option key={caja.id} value={caja.id}>
                {new Date(caja.apertura.toDate()).toLocaleString()} {caja.cierre ? "✅ Cerrada" : "🟢 Abierta"}
              </option>
            ))}
          </select>
        </div>
      )}

      {cargando ? (
        <p>Cargando movimientos...</p>
      ) : movimientos.length === 0 ? (
        <p>No hay movimientos manuales en esta caja.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={th}>Tipo</th>
              <th style={th}>Descripción</th>
              <th style={th}>Monto</th>
              <th style={th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(mov => (
              <tr key={mov.id}>
                <td style={td}>
                  {mov.tipo === "entrada" ? "🟢 Entrada" : "🔴 Salida"}
                </td>
                <td style={td}>{mov.descripcion}</td>
                <td style={td}>${mov.monto?.toFixed(2)}</td>
                <td style={td}>{new Date(mov.fecha?.toDate?.() || mov.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd"
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontSize: "14px"
};

