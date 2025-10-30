import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import styles from "./RegisterLoginForm.module.css";
import { API } from "../../config/api";

interface LoginValues {
  username: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario puede tener máximo 20 caracteres")
    .required("Nombre de usuario requerido"),
  password: Yup.string().required("Contraseña requerida"),
});

export default function LoginForm() {
  const { login } = useUser();
  const navigate = useNavigate();

  const initialValues: LoginValues = { username: "", password: "" };

  const handleSubmit = async (values: LoginValues) => {
    try {
      const res = await axios.post(`${API}users/login`, values);
      // Backend debe devolver { token, username }
      login(res.data.username, res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Iniciar sesión</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="username">Usuario</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" className={styles.error} />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password">Contraseña</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submit}>
              Iniciar sesión
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
