import confirm from "antd/es/modal/confirm";
import {
  ExclamationCircleFilled
} from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    showConfirm();
  }, []);

  const showConfirm = () => {
    confirm({
      title: 'Sair',
      icon: <ExclamationCircleFilled />,
      content: 'Deseja realmente sair?',
      onOk() {
        localStorage.clear();
        window.location.reload();
      },
      onCancel() {
        navigate('/home')
      },
      okCancel: true,
      okText: 'Confirmar',
    });
  };

  return (
    <div></div>
  );
}