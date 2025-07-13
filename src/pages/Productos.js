import { useState } from "react";
import ProductoForm from "../components/ProductoForm";
import ListaProductos from "../components/ListaProductos";

export default function Productos() {
  const [productoEditando, setProductoEditando] = useState(null);

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem", color: "#007bff" }}>📦 Gestión de Productos</h2>
      <ProductoForm
        productoEditando={productoEditando}
        setProductoEditando={setProductoEditando}
      />
      <ListaProductos setProductoEditando={setProductoEditando} />
    </div>
  );
}

