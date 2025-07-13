import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, clave);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Correo o clave incorrecta");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>🔐 Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={styles.input}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Ingresar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f8fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#007bff"
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};



