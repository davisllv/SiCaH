import './style.css'
import { useState, useEffect } from 'react';
import { Table, Button, App, Tooltip, Popconfirm, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, EditFilled, DeleteFilled, LoadingOutlined } from '@ant-design/icons/lib/icons';
import equipamentService from '../../services/equipament-service';

export default function User() {
  const navigate = useNavigate();
  const defaultPageSize = 10;
  const [open, setOpen] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [equipaments, setEquipaments] = useState([]);
  const [totalEquipaments, setTotalEquipaments] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRequesting, setIsRequesting] = useState(false);
  const [changingPage, setChangingPage] = useState(false);
  const { notification } = App.useApp();

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
      await equipamentService.deleteEquipament(id);
      setEquipaments(equipaments.filter((equipament) => equipament.Id !== id));
      success('Sucesso', 'Equipamento excluído com sucesso!');
    } catch {
      error('Erro', 'Não foi possível excluir o Equipamento!');
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
      title: 'Ip',
      dataIndex: 'Ip',
      render: (text) => text,
    },
    {
      title: 'Descrição',
      dataIndex: 'Descricao',
      render: (text) => text || 'Nao informado',
    },
    {
      title: 'Ações',
      dataIndex: '',
      render: (_, equipament) => (
        <div style={{ width: '100px' }}>
          <Tooltip title="Detalhes">
            <Button disabled={changingPage} onClick={() => navigateToDetails(equipament.Id)} type="text" icon={<EyeFilled />}></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button disabled={changingPage} onClick={() => navigateToEdit(equipament.Id)} type="text" icon={<EditFilled />}></Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Atenção"
              description="Deseja realmente excluir esse equipamento?"
              okText="Sim"
              cancelText="Não"
              okButtonProps={{
                loading: confirmLoading,
              }}
              open={open[equipament.Id]}
              onConfirm={() => handleDelete(equipament.Id)}
              onCancel={handleCancel}
            >
              <Button disabled={changingPage} type="text" icon={<DeleteFilled />} onClick={showPopconfirm}></Button>
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ]

  const onShowSizeChange = (_, pageSize) => {
    setPageSize(pageSize);
    fetchData(pageSize, 0);
    setCurrentPage(1);
  };

  const onPageChange = (current, pageSize) => {
    const skip = (current - 1) * pageSize;
    setCurrentPage(current);
    fetchData(pageSize, skip);
  }

  const fetchData = (take, skip, filteredCompanyId) => {
    setChangingPage(true);
    equipamentService.getUsers(take, skip, filteredCompanyId)
      .then((response) => {
        setEquipaments(response.equipaments);
        setTotalEquipaments(response.total);
      }).catch((error) => {
        if (error.message) {
          error('Erro', error.message);
        } else {
          error('Erro', 'Não foi possível carregar os dados');
        }
      }).finally(() => {
        setIsRequesting(false);
        setChangingPage(false);
      });
  }

  useEffect(() => {
    setIsRequesting(true);
    fetchData(defaultPageSize, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="user-container">
      <div className="dflex flex-column">
        <div className="dflex justify-content-between">
          <h2>Equipamentos</h2>
          <Button variant="light" onClick={navigateToCreate}>
            <div className="dflex align-items-center">
              <PlusCircleFilled style={{ marginRight: '10px' }} />
              <span style={{ fontWeight: '600' }}>Adicionar equipamento</span>
            </div>
          </Button>
        </div>
      </div>
      {(equipaments.length === 0 && !isRequesting) &&
        <div className="empty-result">
          <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
          <p>Nenhum equipamento encontrado</p>
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
      {(!isRequesting && equipaments.length > 0) &&
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
            dataSource={equipaments}
            rowKey="id"
            pagination={{
              total: totalEquipaments,
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