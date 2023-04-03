import { Form } from 'antd';
import './style.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    passwordConfirmation: yup.string().required().oneOf([yup.ref('password'), null], 'Senhas não são iguais'),
  });

  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Insira seu usuário';
    }

    if (!values.email) {
      errors.email = 'Insira seu email';
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)) {
        errors.email = 'Insira um usuário válido';
      }
    }

    if (!values.password) {
      errors.password = 'Insira sua senha';
    }

    return errors;
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate,
    validationSchema: schema,
    onSubmit: async values => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 5000);
      // chamar API para efetuar autenticação
    },
  })

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        <h2>Cadastrar usuário</h2>
      </div>
      <div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control type="text" name="name" onChange={formik.handleChange} value={formik.values.name} />
            {formik.errors.name &&
              <Form.Text className="text-danger">
                {formik.errors.name}
              </Form.Text>
            }
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={formik.handleChange} value={formik.values.email} />
            {formik.errors.email &&
              <Form.Text className="text-danger">
                {formik.errors.email}
              </Form.Text>
            }
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="dflex justify-content-between">
              <div className="password-field">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="email" name="password" onChange={formik.handleChange} value={formik.values.password} />
                {formik.errors.password &&
                  <Form.Text className="text-danger">
                    {formik.errors.password}
                  </Form.Text>
                }
              </div>
              <div className="password-field">
                <Form.Label>Confirmar senha</Form.Label>
                <Form.Control type="email" name="passwordConfirmation" onChange={formik.handleChange} value={formik.values.passwordConfirmation} />
                {formik.errors.passwordConfirmation &&
                  <Form.Text className="text-danger">
                    {formik.errors.passwordConfirmation}
                  </Form.Text>
                }
              </div>
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}