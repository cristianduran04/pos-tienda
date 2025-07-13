import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Routes, Route } from "react-router-dom";
import Bienvenida from "./Bienvenida";
import Productos from "./Productos";
import Ventas from "./Ventas";
import Historial from "./Historial";
import ListaReabastecimientos from "../components/ListaReabastecimientos";
import Caja from "./Caja";
// ✅ Importar el layout si lo usarás
import Layout from "../components/Layout"; // Asegúrate que la ruta sea correcta
import MovimientosCaja from "../components/MovimientosCaja";

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Topbar />
        <div style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Bienvenida />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/reabastecimientos" element={<ListaReabastecimientos />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/movimientos" element={<MovimientosCaja />} />
            <Route path="/productos" element={<Layout><Productos /></Layout>} />

          </Routes>
        </div>
      </div>
    </div>
  );
}


