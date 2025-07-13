import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function ResumenVenta({ carrito, setCarrito }) {
  const { usuario } = useAuth();

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const gananciaTotal = carrito.reduce((sum, item) => {
    const compra = item.precioCompra ?? 0;
    return sum + (item.precio - compra) * item.cantidad;
  }, 0);

  const confirmarVenta = async () => {
    if (!usuario || carrito.length === 0) return;

    try {
      const refCajas = collection(db, "tiendas", usuario.uid, "cajas");
      const cajasAbiertas = await getDocs(query(refCajas, where("cierre", "==", null)));

      if (cajasAbiertas.empty) {
        alert("⚠️ No hay una caja abierta. Por favor abre caja antes de registrar una venta.");
        return;
      }

      const venta = {
        productos: carrito.map(p => ({
          id: p.id,
          nombre: p.nombre,
          cantidad: p.cantidad,
          medida: p.medida || "unidad",
          precioCompra: p.precioCompra ?? 0,
          precioVenta: p.precio,
          precioUnitario: p.precio,
          ganancia: (p.precio - (p.precioCompra ?? 0)) * p.cantidad,
          subtotal: p.precio * p.cantidad
        })),
        total,
        ganancia: gananciaTotal,
        fecha: new Date()
      };

      const refVentas = collection(db, "tiendas", usuario.uid, "ventas");
      await addDoc(refVentas, venta);

      for (const item of carrito) {
        const refProd = doc(db, "tiendas", usuario.uid, "productos", item.id);
        const snap = await getDoc(refProd);
        const data = snap.data();
        const nuevoStock = (data?.stock || 0) - item.cantidad;
        await updateDoc(refProd, { stock: nuevoStock });
      }

      const caja = cajasAbiertas.docs[0];
      const movRef = collection(db, "tiendas", usuario.uid, "cajas", caja.id, "movimientos");
      await addDoc(movRef, {
        tipo: "entrada",
        descripcion: "Venta registrada",
        monto: total,
        fecha: new Date()
      });

      alert("✅ Venta registrada correctamente.");
      setCarrito([]);
    } catch (e) {
      console.error("Error al guardar la venta:", e);
      alert("❌ Ocurrió un error al guardar la venta.");
    }
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(p => p.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad);
    if (isNaN(cantidad) || cantidad < 1) return;

    const producto = carrito.find(p => p.id === id);
    if (producto && cantidad > producto.stock) {
      alert(`⚠️ Solo hay ${producto.stock} unidades en stock para "${producto.nombre}".`);
      return;
    }

    setCarrito(carrito.map(p =>
      p.id === id ? { ...p, cantidad } : p
    ));
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "#007bff", marginBottom: "1rem" }}>📑 Resumen de Venta</h3>

      <div
        style={{
          maxHeight: "320px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          background: "#fafafa",
          marginBottom: "1rem"
        }}
      >
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={th}>Producto</th>
                <th style={th}>Cantidad</th>
                <th style={th}>Precio</th>
                <th style={th}>Subtotal</th>
                <th style={th}>Ganancia</th>
                <th style={th}>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((p) => {
                const compra = p.precioCompra ?? 0;
                const ganancia = (p.precio - compra) * p.cantidad;
                return (
                  <tr key={p.id}>
                    <td style={td}>{p.nombre}</td>
                    <td style={td}>
                      <input
                        type="number"
                        min="1"
                        value={p.cantidad}
                        onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                        style={{
                          width: "60px",
                          padding: "4px",
                          borderRadius: "4px",
                          border: "1px solid #ccc"
                        }}
                      />
                      <span style={{ fontSize: "12px", color: "#888", marginLeft: "4px" }}>
                        / {p.stock}
                      </span>
                    </td>
                    <td style={td}>${p.precio}</td>
                    <td style={td}>${(p.precio * p.cantidad).toFixed(2)}</td>
                    <td style={td}>${ganancia.toFixed(2)}</td>
                    <td style={td}>
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div style={cardTotal}>💰 Total: ${total.toFixed(2)}</div>
        <div style={cardGanancia}>Ganancia: ${gananciaTotal.toFixed(2)}</div>
      </div>

      <button
        onClick={confirmarVenta}
        disabled={carrito.length === 0}
        style={{
          marginTop: "1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        💾 Confirmar Venta
      </button>
    </div>
  );
}

const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #ccc"
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #eee"
};

const cardTotal = {
  backgroundColor: "#28a745",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: "8px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  minWidth: "200px",
  textAlign: "center"
};

const cardGanancia = {
  backgroundColor: "#17a2b8",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "8px",
  fontSize: "1rem",
  fontWeight: "500",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  minWidth: "180px",
  textAlign: "center"
};


