import './style.css'
import { useState, useEffect } from 'react';
import { Table, Button, notification, Tooltip, Popconfirm, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, SmileFilled, EditFilled, DeleteFilled, LoadingOutlined } from '@ant-design/icons/lib/icons';
import userService from '../../services/user-service';

export default function User() {
  const navigate = useNavigate();
  const [open, setOpen] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleUserHumor = (humor) => {
    if (!humor) {
      return 'Não detectado';
    }

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
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      success('Sucesso', 'Usuário excluído com sucesso!');
    } catch (error) {
      error('Erro', 'Não foi possível excluir o usuário!');
    } finally {
      setOpen((prevOpen) => ({
        ...prevOpen,
        [id]: false
      }));
      setConfirmLoading(false);
    }
  }

  const handleCancel = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: false
    }));
  };

  const showPopconfirm = (id) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [id]: true
    }));
  };

  const success = (title, message) => {
    notificationApi.success({
      message: title,
      description: message,
    });
  };

  const error = (title, message) => {
    notificationApi.error({
      message: title,
      description: message,
    });
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      render: (text) => text,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => text,
    },
    {
      title: 'Permite capturar imagens',
      dataIndex: 'permite_foto',
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
              open={open[user.id]}
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

  useEffect(() => {
    setIsRequesting(true);
    userService.getUsers()
      .then((response) => {
        setUsers(response);
      }).catch((error) => {
        error('Erro', 'Não foi possível carregar os dados');
      }).finally(() => {
        setIsRequesting(false);
      });
  }, [])

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
      {(users.length === 0 && !isRequesting) &&
        <div className="empty-result">
          <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
          <p>Nenhum usuário encontrado</p>
        </div>
      }
      {isRequesting &&
        <div className="dflex justify-content-center align-items-center" style={{ height: '80%' }}>
          <Spin
            indicator={<LoadingOutlined
              style={{ fontSize: 60 }}
              spin />}
          />
        </div>
      }
      {(!isRequesting && users.length > 0) &&
        <Table columns={columns} dataSource={users} rowKey="id" />
      }
    </div>
  )
}