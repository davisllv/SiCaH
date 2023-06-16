import "./style.css";
import { Card, Col, Row, App, Spin } from "antd";
import { useEffect, useState } from "react";
import emotionService from "../../services/emotion-service";
import { LoadingOutlined } from "@ant-design/icons";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { notification } = App.useApp();

  useEffect(() => {
    emotionService.getDashboard()
      .then((response) => {
        setData({ ...response.data });
      }).catch((_) => {
        notification.error({
          message: 'Erro',
          description: 'Não foi possível carregar os dados',
        });
      }).finally((_) => {
        setIsLoading(false);
      });
  }, [])

  return <div style={{ width: "100%", padding: '24px' }}>
    {isLoading &&
      <Spin style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 2, top: '25%' }}
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 24,
            }}
            spin
          />
        }
      />
    }
    {!isLoading &&
      <Row gutter={16}>
        <Col span={5}>
          <Card title="Total de emoções detectadas">
            {data.totalEmocoes}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Emoção com maior recorrência">
            {data.maiorRecorrencia}
          </Card>
        </Col>
      </Row>
    }
  </div>;
}
