// src/pages/Caja.js
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Caja() {
  const { usuario } = useAuth();
  const [caja, setCaja] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [montoInicial, setMontoInicial] = useState(0);
  const [montoMovimiento, setMontoMovimiento] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [baseDejada, setBaseDejada] = useState(0);
  const [historial, setHistorial] = useState([]);

  const cajaId = "principal";

  useEffect(() => {
    if (!usuario) return;

    const ref = doc(db, "tiendas", usuario.uid, "cajas", cajaId);
    const unsub = onSnapshot(ref, async (snap) => {
      const data = snap.exists() ? snap.data() : null;
      setCaja(data);

      // Movimientos manuales
      const movRef = collection(db, "tiendas", usuario.uid, "cajas", cajaId, "movimientos");
      onSnapshot(query(movRef, orderBy("fecha", "desc")), (snapMov) => {
        const data = snapMov.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMovimientos(data);
      });

      // Historial
      const histRef = collection(db, "tiendas", usuario.uid, "cajas", cajaId, "historial");
      const snapHist = await getDocs(query(histRef, orderBy("apertura", "desc")));
      const historico = snapHist.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistorial(historico);
    });

    return unsub;
  }, [usuario]);

  const abrirCaja = async () => {
    if (!usuario) return;
    const ref = doc(db, "tiendas", usuario.uid, "cajas", cajaId);
    await setDoc(ref, {
      nombre: "Principal",
      abierta: true,
      montoInicial: Number(montoInicial),
      apertura: new Date(),
      cierre: null,
      montoFinal: null,
      baseDejada: null,
      retiro: null
    });
    setMontoInicial(0);
  };

  const cerrarCaja = async () => {
    if (!usuario || !caja?.abierta) return;
    const base = Number(baseDejada);

    const totalActual = movimientos.reduce(
      (sum, m) => m.tipo === "salida" ? sum - m.monto : sum + m.monto,
      caja.montoInicial
    );

    const retiro = totalActual - base;

    const cajaRef = doc(db, "tiendas", usuario.uid, "cajas", cajaId);
    const histRef = collection(db, "tiendas", usuario.uid, "cajas", cajaId, "historial");

    // Guardar retiro como movimiento
    const movRef = collection(db, "tiendas", usuario.uid, "cajas", cajaId, "movimientos");
    if (retiro > 0) {
      await addDoc(movRef, {
        tipo: "salida",
        descripcion: "Retiro de caja al cierre",
        monto: retiro,
        fecha: new Date(),
        manual: false
      });
    }

    await addDoc(histRef, {
      apertura: caja.apertura,
      cierre: new Date(),
      montoInicial: caja.montoInicial,
      montoFinal: totalActual,
      baseDejada: base,
      retiro: retiro
    });

    await updateDoc(cajaRef, {
      abierta: false,
      cierre: new Date(),
      montoFinal: totalActual,
      baseDejada: base,
      retiro: retiro
    });
  };

  const registrarMovimiento = async () => {
    if (!usuario || !caja?.abierta) return;
    const movRef = collection(db, "tiendas", usuario.uid, "cajas", cajaId, "movimientos");
    await addDoc(movRef, {
      tipo,
      descripcion,
      monto: Number(montoMovimiento),
      fecha: new Date(),
      manual: true
    });
    setMontoMovimiento(0);
    setDescripcion("");
  };

  const totalActual = movimientos.reduce(
    (sum, m) => m.tipo === "salida" ? sum - m.monto : sum + m.monto,
    caja?.montoInicial || 0
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🧾 Caja: Principal</h2>

      <div style={{
        background: "#f1f1f1",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3>📦 Estado: {caja?.abierta ? "Abierta ✅" : "Cerrada ❌"}</h3>
        <p><strong>Monto Inicial:</strong> ${caja?.montoInicial ?? 0}</p>
        {caja?.abierta && <p><strong>Dinero Actual:</strong> ${totalActual}</p>}

        {caja?.abierta ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
            <input
              type="number"
              value={baseDejada}
              onChange={(e) => setBaseDejada(e.target.value)}
              placeholder="Base a dejar al cierre"
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button onClick={cerrarCaja} style={btnRojo}>Cerrar Caja</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <input
              type="number"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              placeholder="Monto inicial"
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button onClick={abrirCaja} style={btnVerde}>Abrir Caja</button>
          </div>
        )}
      </div>

      {caja?.abierta && (
        <div>
          <h4>➕ Registrar Movimiento Manual</h4>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción"
            />
            <input
              type="number"
              value={montoMovimiento}
              onChange={(e) => setMontoMovimiento(e.target.value)}
              placeholder="Monto"
            />
            <button onClick={registrarMovimiento}>Registrar</button>
          </div>

          
        </div>
      )}

      <h3 style={{ marginTop: "2rem" }}>📚 Historial de Cierres</h3>
      <table border="1" cellPadding="6" style={{ width: "100%", background: "#fff" }}>
        <thead>
          <tr>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Inicial</th>
            <th>Final</th>
            <th>Base</th>
            <th>Retiro</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((h, i) => (
            <tr key={i}>
              <td>{new Date(h.apertura.toDate?.()).toLocaleString()}</td>
              <td>{new Date(h.cierre.toDate?.()).toLocaleString()}</td>
              <td>${h.montoInicial}</td>
              <td>${h.montoFinal}</td>
              <td>${h.baseDejada}</td>
              <td>${h.retiro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnVerde = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const btnRojo = {
  backgroundColor: "#dc3545",
  color: "white",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};


