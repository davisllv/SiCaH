/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin, App } from 'antd';
import { LeftOutlined, LockFilled, SaveFilled, UserOutlined, LoadingOutlined, ApiOutlined, MessageOutlined } from '@ant-design/icons';
import equipamentService from '../../../services/equipament-service';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [equipament, setEquipament] = useState({});
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  useEffect(() => {
    const { pathname } = window.location;
    setIsLoading(true);
    if (pathname.includes('edit') || pathname.includes('details')) {
      if (pathname.includes('edit')) {
        setIsEditing(true);
      } else {
        setIsDetails(true);
      }

      findEquipament(pathname.split('/').pop());
    } else {
      setIsLoading(false);
    }
  }, []);

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
  };

  const findEquipament = (id) => {
    equipamentService.findEquipament(id).then((response) => {
      setEquipament(response);
      form.setFieldsValue({
        ...response,
      })
      setIsLoading(false);
    });
  }

  const onFinish = async (entity) => {
    try {
      setIsSubmitting(true);

      if (!isEditing) {
        await equipamentService.createEquipament(entity);
        success('Sucesso', 'Equipamento cadastrado com sucesso!');
      } else {
        entity = {
          Id: equipament.id,
          ...entity
        }
        await equipamentService.updateEquipament(entity.Id, entity);
        success('Sucesso', 'Equipamento atualizado com sucesso!');
      }

      back();
    } catch (err) {
      if (!isEditing) {
        error('Erro', 'Erro ao cadastrar equipamento!');
      } else {
        error('Erro', 'Erro ao atualizar equipamento!');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const back = () => {
    navigate(-1);
  }

  const validateMessages = {
    required: 'Campo é obrigatório!',
    types: {
      email: 'Email inválido',
    },
  };

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        {
          isEditing &&
          <h2>Editar equipamento</h2>
        }
        {
          isDetails &&
          <h2>Detalhes do equipamento</h2>
        }
        {
          (!isEditing && !isDetails) &&
          <h2>Cadastrar equipamento</h2>
        }
      </div>
      {!isLoading &&
        <div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={equipament}
            size="large"
            validateMessages={validateMessages}
            disabled={isSubmitting || isDetails}
          >
            <Form.Item
              name="Ip"
              label='IP'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}$/,
                  message: `IP inválido`
                }
              ]}
            >
              <Input prefix={<ApiOutlined />} />
            </Form.Item>
            <Form.Item
              name="Usuario"
              rules={[
                {
                  required: true,
                },
              ]}
              label='Usuário'
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="Descricao"
              rules={[
                {
                  required: false,
                },
              ]}
              label='Descrição'
            >
              <Input prefix={<MessageOutlined />} />
            </Form.Item>{!isDetails &&
              <div className="dflex justify-content-between">
                <Form.Item
                  className="password-field"
                  name="senha"
                  rules={[
                    {
                      required: !isEditing && !isDetails,
                    },
                  ]}
                  label="Senha"
                >
                  <Input.Password prefix={<LockFilled />} />
                </Form.Item>
                <Form.Item
                  className="password-field"
                  name="confirm"
                  dependencies={['senha']}
                  rules={[
                    {
                      required: !isDetails && !isEditing,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('senha') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Senhas não são iguais!'));
                      },
                    }),
                  ]}
                  label="Confirmar senha"
                >
                  <Input.Password prefix={<LockFilled />} />
                </Form.Item>
              </div>}
            <Form.Item>
              <div className="dflex">
                <Button htmlType="button" type="text" onClick={back} disabled={isSubmitting}>
                  <LeftOutlined />
                  Voltar
                </Button>
                {!isDetails &&
                  <Button htmlType="submit" type="primary" style={{ marginLeft: '10px' }} disabled={isSubmitting}>
                    {!isSubmitting &&
                      <>
                        <SaveFilled />
                        <span style={{ marginLeft: '10px' }}>Salvar</span>
                      </>
                    }
                    {isSubmitting &&
                      <>
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{ fontSize: 18, color: 'black' }}
                              spin
                            />
                          }
                        />

                        <span style={{ marginLeft: '10px' }}>Salvando</span>
                      </>
                    }
                  </Button>
                }
              </div>
            </Form.Item>
          </Form>
        </div>
      }
      {
        isLoading &&
        <div style={{ height: '80%' }}>
          <div className="dflex justify-content-center align-items-center" style={{ height: '90%' }}>
            <Spin
              indicator={<LoadingOutlined
                style={{ fontSize: 60 }}
                spin />}
            />
          </div>
        </div>
      }
    </div >
  )
}