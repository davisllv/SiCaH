import { useCallback, useState } from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PlugFill } from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";

export default function Integracao() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConectarBancoDados = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <div className="integration-container">
      <h2>Integração</h2>
      <Form style={{ width: "60%", padding: 0 }}>
        <Form.Group className="mb-3" controlId="enderecoBancoDados">
          <Form.Label>Endereço do Banco de Dados</Form.Label>
          <Form.Control type="text" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="usuario">
          <Form.Label>Usuário</Form.Label>
          <Form.Control type="text" placeholder="Usuário" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConectarBancoDados}
          >
            {isLoading ? (
              <>
                <>
                  <Spinner
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
                <PlugFill />
                Conectar
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
