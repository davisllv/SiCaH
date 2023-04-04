import './style.css'
import { useState } from 'react';
import { Table, Button, message, Tooltip, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, SmileFilled, EditFilled, DeleteFilled } from '@ant-design/icons/lib/icons';

export default function User() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState([
    {
      name: 'Vinicius da Cruz Rodrigues Paulo',
      email: 'vinicius@sicah.com',
      captureImage: false,
      humor: 'smile',
      id: 1
    },
  ]);

  const handleUserHumor = (humor) => {
    if (humor === 'smile') {
      return <SmileFilled />
    }
  }

  const navigateToCreate = () => {
    navigate('create');
  }

  const navigateToEdit = (id) => {
    navigate(`edit/${id}`);
  }

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      success('Usuário excluído com sucesso!');
    }, 2000);
  }

  const handleCancel = () => {
    setOpen(false);
  };

  const showPopconfirm = () => {
    setOpen(true);
  };

  const success = (content) => {
    messageApi.open({
      type: 'success',
      content,
    });
  };

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
        <div style={{ width: '100px' }}>
          <Tooltip title="Detalhes">
            <Button type="text" icon={<EyeFilled />}></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button onClick={() => navigateToEdit(user.id)} type="text" icon={<EditFilled />}></Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Atenção"
              description="Deseja realmente excluir esse usuário?"
              okText="Sim"
              cancelText="Não"
              okButtonProps={{
                loading: confirmLoading,
              }}
              open={open}
              onConfirm={() => handleDelete(user.id)}
              onCancel={handleCancel}
            >
              <Button type="text" icon={<DeleteFilled />} onClick={showPopconfirm}></Button>
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div className="user-container">
      {contextHolder}
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
        <Table columns={columns} dataSource={users} rowKey="id" />
      }
    </div>
  )
}