import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import styles from "./RegisterLoginForm.module.css";
import { API } from "../../config/api";

interface RegisterValues {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario puede tener máximo 20 caracteres")
    .required("Nombre de usuario requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debes repetir la contraseña"),
});

export default function RegisterForm() {
  const { login } = useUser();
  const navigate = useNavigate();

  const initialValues: RegisterValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: RegisterValues) => {
    try {
      const res = await axios.post(`${API}/users/register`, {
        username: values.username,
        password: values.password,
      });
      // Backend debe devolver { token, username }
      login(res.data.username, res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Error al registrarse");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Registrarse</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
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

            <div className={styles.fieldGroup}>
              <label htmlFor="confirmPassword">Repetir Contraseña</label>
              <Field name="confirmPassword" type="password" />
              <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submit}>
              Registrarse
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
