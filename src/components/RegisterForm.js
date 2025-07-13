import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreTienda, setNombreTienda] = useState("");

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Crear documento de tienda
      await setDoc(doc(db, "tiendas", uid), {
        nombre: nombreTienda,
        emailPropietario: email,
        createdAt: new Date()
      });

      alert("Registro exitoso");
    } catch (err) {
      console.error(err);
      alert("Error al registrar");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input placeholder="Nombre de tienda" value={nombreTienda} onChange={e => setNombreTienda(e.target.value)} />
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Registrar</button>
    </form>
  );
}
