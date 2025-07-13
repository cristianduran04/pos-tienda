// src/components/Layout.js
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ padding: "1.5rem", overflowY: "auto", flexGrow: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
