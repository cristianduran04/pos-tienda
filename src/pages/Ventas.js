import { useState } from "react";
import SelectorProductos from "../components/SelectorProductos";
import ResumenVenta from "../components/ResumenVenta";

export default function Ventas() {
  const [carrito, setCarrito] = useState([]);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 1 }}>
        <SelectorProductos carrito={carrito} setCarrito={setCarrito} />
      </div>
      <div style={{ flex: 1 }}>
        <ResumenVenta carrito={carrito} setCarrito={setCarrito} />
      </div>
    </div>
  );
}
