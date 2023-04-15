import { useState, useEffect } from 'react';
import { Table, Button, App, Tooltip, Popconfirm, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import EmptyResult from '../../assets/empty-result.jpg';
import { EyeFilled, PlusCircleFilled, EditFilled, DeleteFilled, LoadingOutlined } from '@ant-design/icons/lib/icons';
import companyService from '../../services/company-service';

export default function User() {
  const navigate = useNavigate();
  const defaultPageSize = 10;
  const [open, setOpen] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
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
      await companyService.deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
      success('Sucesso', 'Empresa excluída com sucesso!');
    } catch {
      error('Erro', 'Não foi possível excluir a empresa!');
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
      title: 'CNPJ',
      dataIndex: 'cnpj',
      render: (text) => text,
    },
    {
      title: 'Ações',
      dataIndex: '',
      render: (_, company) => (
        <div style={{ width: '100px' }}>
          <Tooltip title="Detalhes">
            <Button disabled={changingPage} onClick={() => navigateToDetails(company.id)} type="text" icon={<EyeFilled />}></Button>
          </Tooltip>
          <Tooltip title="Editar">
            <Button disabled={changingPage} onClick={() => navigateToEdit(company.id)} type="text" icon={<EditFilled />}></Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Popconfirm
              title="Atenção"
              description="Deseja realmente excluir essa empresa?"
              okText="Sim"
              cancelText="Não"
              okButtonProps={{
                loading: confirmLoading,
              }}
              open={open[company.id]}
              onConfirm={() => handleDelete(company.id)}
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
    companyService.getCompanies(take, skip)
      .then((response) => {
        setCompanies(response.companies);
        setTotalCompanies(response.total);
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
      <div className="dflex justify-content-between">
        <h2>Empresas</h2>
        <Button variant="light" onClick={navigateToCreate}>
          <div className="dflex align-items-center">
            <PlusCircleFilled style={{ marginRight: '10px' }} />
            <span style={{ fontWeight: '600' }}>Adicionar empresa</span>
          </div>
        </Button>
      </div>
      {(companies.length === 0 && !isRequesting) &&
        <div className="empty-result">
          <img src={EmptyResult} alt="Nenhum resultado foi encontrado" />
          <p>Nenhuma empresa encontrada</p>
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
      {(!isRequesting && companies.length > 0) &&
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
            dataSource={companies}
            rowKey="id"
            pagination={{
              total: totalCompanies,
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