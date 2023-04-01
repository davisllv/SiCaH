import "./style.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Insira seu usuário";
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.username = "Insira um usuário válido";
      }
    }

    if (!values.password) {
      errors.password = "Insira sua senha";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: "sicah@outlook.com",
      password: "admin123",
    },
    validate,
    validationSchema: schema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 5000);
      // chamar API para efetuar autenticação
    },
  });

  return (
    <div className="login-container dflex justify-content-center align-items-center flex-column">
      <div className="form-container">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuário</Form.Label>
            <Form.Control
              type="email"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username && (
              <Form.Text className="text-danger">
                {formik.errors.username}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password && (
              <Form.Text className="text-danger">
                {formik.errors.password}
              </Form.Text>
            )}
          </Form.Group>
          <Link className="recover-password-link">Recuperar senha</Link>
          <div className="dflex justify-content-center submit-container">
            <Button variant="dark" type="submit">
              {isLoading ? (
                <>
                  <Spinner
                    animation="border"
                    role="status"
                    size="sm"
                    style={{ marginRight: "0.5rem" }}
                  />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </Form>
        <Link className="register-link">
          Gostaria de se cadastrar? Clique aqui
        </Link>
      </div>
    </div>
  );
}
