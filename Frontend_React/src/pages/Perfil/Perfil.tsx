import { useUser } from "../../contexts/UserContext";
import styles from "./Perfil.module.css";

export default function Perfil() {
  const { user, login, logout } = useUser();

  const handleLogin = () => {
    // simulamos un login
    login({
      name: "María Guadalupe Naveyra",
      email: "nutriapp@gmail.com",
      avatar: "https://i.pravatar.cc/150?img=47",
    });
  };

  return (
    <div className={styles.container}>
      <h1>Perfil del Usuario</h1>

      {user ? (
        <div className={styles.profileCard}>
          <img src={user.avatar} alt="avatar" className={styles.avatar} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      ) : (
        <div className={styles.loginCard}>
          <p>No has iniciado sesión.</p>
          <button onClick={handleLogin}>Iniciar sesión</button>
        </div>
      )}
    </div>
  );
}
