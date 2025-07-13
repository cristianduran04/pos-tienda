export default function Reportes({ ventas }) {
  const totalVendido = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
  const gananciaTotal = ventas.reduce((sum, v) => sum + (v.ganancia || 0), 0);

  const contadorProductos = {};
  const gananciasPorProducto = {};

  ventas.forEach(v => {
    v.productos.forEach(p => {
      if (!contadorProductos[p.nombre]) contadorProductos[p.nombre] = 0;
      contadorProductos[p.nombre] += p.cantidad;

      if (!gananciasPorProducto[p.nombre]) gananciasPorProducto[p.nombre] = 0;
      gananciasPorProducto[p.nombre] += p.ganancia || 0;
    });
  });

  const productoMasVendido = Object.entries(contadorProductos)
    .sort((a, b) => b[1] - a[1])[0];

  const productoMasRentable = Object.entries(gananciasPorProducto)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "#28a745" }}>📊 Reporte General</h3>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        marginTop: "1rem"
      }}>
        <Card
          titulo="Total Vendido"
          valor={`$${totalVendido.toFixed(2)}`}
          color="#28a745"
        />
        <Card
          titulo="Ganancia Total"
          valor={`$${gananciaTotal.toFixed(2)}`}
          color="#007bff"
        />
        {productoMasVendido && (
          <Card
            titulo="Producto Más Vendido"
            valor={`${productoMasVendido[0]} (${productoMasVendido[1]} und)`}
            color="#6f42c1"
          />
        )}
        {productoMasRentable && (
          <Card
            titulo="Más Rentable"
            valor={`${productoMasRentable[0]} ($${productoMasRentable[1].toFixed(2)})`}
            color="#fd7e14"
          />
        )}
      </div>
    </div>
  );
}

function Card({ titulo, valor, color }) {
  return (
    <div style={{
      flex: "1 1 220px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      borderLeft: `6px solid ${color}`
    }}>
      <h4 style={{ marginBottom: "0.5rem", color }}>{titulo}</h4>
      <p style={{
        fontSize: "1.4rem",
        fontWeight: "bold",
        color: "#333",
        margin: 0
      }}>{valor}</p>
    </div>
  );
}


