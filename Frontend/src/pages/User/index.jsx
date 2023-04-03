import './style.css'
import { useState } from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, SmileFilled, EditFilled, DeleteFilled } from '@ant-design/icons/lib/icons';

export default function User() {
  const navigation = useNavigate();
  const [users, setUsers] = useState([
    {
      name: 'Vinicius da Cruz Rodrigues Paulo',
      email: 'vinicius@sicah.com',
      captureImage: false,
      humor: 'smile'
    },
  ]);

  const handleUserHumor = (humor) => {
    if (humor === 'smile') {
      return <SmileFilled />
    }
  }

  const navigateToCreate = () => {
    navigation('create');
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      render: (text) => text,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => text,
    },
    {
      title: 'Permite capturar imagens',
      dataIndex: 'captureImage',
      render: (flag) => flag ? 'Sim' : 'Não',
    },
    {
      title: 'Humor',
      dataIndex: 'humor',
      render: (humor) => handleUserHumor(humor),
    },
    {
      title: 'Ações',
      dataIndex: '',
      render: (_, user) => (
        <Space size="middle">
          <Tooltip title="Detalhes">
            <EyeFilled style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Editar">
            <EditFilled style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Excluir">
            <DeleteFilled style={{ cursor: 'pointer' }} />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        <h2>Usuários</h2>
        <Button variant="light" onClick={navigateToCreate}>
          <div className="dflex align-items-center">
            <PlusCircleFilled style={{ marginRight: '10px' }} />
            <span style={{ fontWeight: '600' }}>Adicionar usuário</span>
          </div>
        </Button>
      </div>
      {users.length === 0 &&
        <div className="empty-result">
          <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
          <p>Nenhum usuário encontrado</p>
        </div>
      }
      {
        users.length > 0 &&
        <Table columns={columns} dataSource={users} />
      }
    </div>
  )
}