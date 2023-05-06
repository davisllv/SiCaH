/* eslint-disable react-hooks/exhaustive-deps */
import "./style.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../assets/login.svg";
import { useCallback, useState } from "react";
import AuthService from "../../services/auth-service";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { notification } = App.useApp();

  const navigate = useNavigate();

  const TratarErro = (title, message) => {
    notification.error({
      message: title,
      description: message,
    });
  };

  const handleSubmit = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        const response = await AuthService.login(data.email, data.password);

        if (response.status === 200) {
          window.location.reload();
        } else {
          TratarErro("Erro", response.message);
          setIsLoading(false);
        }

      } catch (err) {
        TratarErro("Erro", "Email ou Senha Incorretos!");
        setIsLoading(false);
      }
    },
    [TratarErro, navigate]
  );

  return (
    <div className="principal_container">
      <div className="img_container">
        <img src={LoginImage} alt="Qualquer Coisa" />
      </div>

      <div className="login_container">
        <div className="login_content">
          <h1 className="login_titulo">LOGIN</h1>
          <Form
            layout="vertical"
            className="login_form"
            onFinish={handleSubmit}
            disabled={isLoading}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Digite seu email",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Digite sua senha",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>

            <div className="actions_container">
              <Form.Item name="rememberMe" className="dflex flex-column">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <a href="/">Esqueceu a Senha?</a>
              </Form.Item>
            </div>

            <Form.Item>
              {!isLoading && (
                <Button htmlType="submit" className="button_entrar">
                  Entrar
                </Button>
              )}
              {isLoading && (
                <div className="dflex justify-content-center">
                  <Spin />
                </div>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
