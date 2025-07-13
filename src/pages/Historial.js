import { useState } from "react";
import ListaVentas from "../components/ListaVentas";
import Reportes from "../components/Reportes";

export default function Historial() {
  const [ventas, setVentas] = useState([]);

  return (
    <div>
      <h2>Historial y Reportes</h2>
      <ListaVentas ventas={ventas} setVentas={setVentas} />
      <Reportes ventas={ventas} />
    </div>
  );
}
