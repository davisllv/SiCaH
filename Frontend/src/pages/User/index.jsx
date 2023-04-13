import './style.css'
import { useState, useEffect } from 'react';
import { Table, Button, App, Tooltip, Popconfirm, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, SmileFilled, EditFilled, DeleteFilled, LoadingOutlined } from '@ant-design/icons/lib/icons';
import userService from '../../services/user-service';

export default function User() {
  const navigate = useNavigate();
  const defaultPageSize = 10;
  const [open, setOpen] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [changingPage, setChangingPage] = useState(false);
  const { notification } = App.useApp();

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

  const navigateToDetails = (id) => {
    navigate(`details/${id}`);
  }

  const handleDelete = async (id) => {
    setConfirmLoading(true);
    try {
      await userService.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      success('Sucesso', 'Usuário excluído com sucesso!');
    } catch {
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
    notification.success({
      message: title,
      description: message,
    });
  };

  const error = (title, message) => {
    notification.error({
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
            <Button disabled={changingPage} onClick={() => navigateToDetails(user.id)} type="text" icon={<EyeFilled />}></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button disabled={changingPage} onClick={() => navigateToEdit(user.id)} type="text" icon={<EditFilled />}></Button>
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
              <Button disabled={changingPage} type="text" icon={<DeleteFilled />} onClick={showPopconfirm}></Button>
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ]

  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    fetchData(pageSize, 0);
    setCurrentPage(1);
  };

  const onPageChange = (current, pageSize) => {
    const skip = (current - 1) * pageSize;
    setCurrentPage(current);
    fetchData(pageSize, skip);
  }

  const fetchData = (take, skip) => {
    setChangingPage(true);
    userService.getUsers(take, skip)
      .then((response) => {
        setUsers(response.users);
        setTotalUsers(response.total);
      }).catch((error) => {
        error('Erro', 'Não foi possível carregar os dados');
      }).finally(() => {
        setIsRequesting(false);
        setChangingPage(false);
      });
  }

  useEffect(() => {
    setIsRequesting(true);
    fetchData(defaultPageSize, 0);
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
        <>
          {changingPage &&
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
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              total: totalUsers,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
              defaultPageSize: defaultPageSize,
              pageSize: pageSize,
              onShowSizeChange: onShowSizeChange,
              current: currentPage,
              locale: {
                page: 'Página',
                items_per_page: ' / Página'
              },
              onChange: onPageChange,
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`
            }} />
        </>
      }
    </div>
  )
}