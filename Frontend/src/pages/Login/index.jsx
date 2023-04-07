import "./style.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import LoginImage from '../../assets/login.png';
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const onFinish = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/home");
    }, 3000);
  };

  return (
    <div className="principal-container">
      <div className="img-container">
        <img src={LoginImage} alt="Qualquer Coisa" />
      </div>
      <div className="login-container dflex align-items-center" style={{ marginLeft: '40px' }}>
        <Form
          layout='vertical'
          className="login-form"
          onFinish={onFinish}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Digite seu email',
              },
            ]}
          >
            <Input prefix={<UserOutlined />}
              type="email"
              placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Digite sua senha',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Senha"
            />
          </Form.Item>
          <Form.Item>
            <a href="/">
              Recuperar senha
            </a>
          </Form.Item>
          <Form.Item className="dflex justify-content-center">
            {!isLoading &&
              <Button htmlType="submit">
                Entrar
              </Button>
            }
            {isLoading &&
              <Spin />
            }
          </Form.Item>
          <Form.Item className="dflex justify-content-center">
            Gostaria de se cadastrar?
            <Button type="link" style={{ paddingLeft: '2px' }}>Clique aqui</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
