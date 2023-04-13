import "./style.css";
import { useCallback, useState } from "react";
import { Form, Button, Spin, Input } from "antd";

export default function Integracao() {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleConectarBancoDados = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="integration-container">
      <h2>Integração</h2>
      <Form style={{ width: "60%", padding: 0 }}
        layout="vertical"
        form={form}
      >
        <Form.Item label="Endereço do Banco de Dados">
          <Input type="text" placeholder="Enter email" />
        </Form.Item>

        <Form.Item label="Usuário">
          <Input type="text" placeholder="Usuário" />
        </Form.Item>

        <Form.Item label="Password">
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConectarBancoDados}
          >
            {isLoading ? (
              <>
                <>
                  <Spin
                    animation="border"
                    role="status"
                    size="sm"
                    style={{ marginRight: "0.5rem" }}
                  />
                  Conectando...
                </>
              </>
            ) : (
              <>
                {/* <PlugFill /> */}
                Conectar
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
