import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ProductoForm({ productoEditando, setProductoEditando }) {
  const { usuario } = useAuth();

  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stock, setStock] = useState("");
  const [medida, setMedida] = useState("unidad");

  // Si estás editando un producto, llenar el formulario
  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre || "");
      setPrecioCompra(productoEditando.precioCompra || "");
      setPrecioVenta(productoEditando.precioVenta || "");
      setStock(productoEditando.stock || "");
      setMedida(productoEditando.medida || "unidad");
    } else {
      setNombre("");
      setPrecioCompra("");
      setPrecioVenta("");
      setStock("");
      setMedida("unidad");
    }
  }, [productoEditando]);

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    const nuevoProducto = {
      nombre,
      precioCompra: parseFloat(precioCompra),
      precioVenta: parseFloat(precioVenta),
      stock: parseInt(stock),
      medida
    };

    try {
      if (productoEditando) {
        const ref = doc(db, "tiendas", usuario.uid, "productos", productoEditando.id);
        await updateDoc(ref, nuevoProducto);
        alert("Producto actualizado");
      } else {
        const ref = collection(db, "tiendas", usuario.uid, "productos");
        await addDoc(ref, nuevoProducto);
        alert("Producto agregado");
      }
      // limpiar el form
      setProductoEditando(null);
      setNombre("");
      setPrecioCompra("");
      setPrecioVenta("");
      setStock("");
      setMedida("unidad");
    } catch (e) {
      console.error("Error al guardar:", e);
    }
  };

  return (
    <form onSubmit={guardarProducto} style={{ marginBottom: "1rem" }}>
      <h3>{productoEditando ? "Editar Producto" : "Agregar Producto"}</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio Compra"
        value={precioCompra}
        onChange={(e) => setPrecioCompra(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio Venta"
        value={precioVenta}
        onChange={(e) => setPrecioVenta(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <select value={medida} onChange={(e) => setMedida(e.target.value)}>
        <option value="unidad">Unidad</option>
        <option value="gr">Gramos</option>
        <option value="ml">Mililitros</option>
        <option value="paquete">Paquete</option>
      </select>
      <br />
      <button type="submit">
        {productoEditando ? "Actualizar" : "Guardar"}
      </button>
      {productoEditando && (
        <button type="button" onClick={() => setProductoEditando(null)} style={{ marginLeft: "1rem" }}>
          Cancelar edición
        </button>
      )}
    </form>
  );
}


