/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Switch, Upload, DatePicker, Select, Spin, App } from 'antd';
import { CameraFilled, LeftOutlined, LockFilled, MailFilled, SaveFilled, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import userService from '../../../services/user-service';
import companyService from '../../../services/company-service';
dayjs.extend(customParseFormat);

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(true);
  const [userImage, setUserImage] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [user, setUser] = useState({});
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const dateFormatList = ['DD/MM/YYYY'];
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
      findUser(pathname.split('/').pop());
    } else {
      fetchCompanies().then(() => setIsLoading(false))
    }
  }, []);

  const fetchCompanies = async () => {
    companyService.getCompanies(null, 0)
      .then((response) => {
        setCompanies(response.companies);
      }).catch((error) => {
        error('Erro', 'Não foi possível carregar os dados');
      })
  }

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

  const findUser = (id) => {
    fetchCompanies().then(() => {
      userService.findUser(id).then((response) => {
        setUser(response);
        form.setFieldsValue({
          ...response,
          dataNasc: dayjs(response.dataNasc)
        })
        setIsLoading(false);
      });
    });
  }

  const onFinish = async (entity) => {
    try {
      setIsSubmitting(true);
      entity = {
        ...entity,
        dataNasc: entity.dataNasc?.toDate().toISOString() || '',
        id_endereco: user.id_endereco || 0,
        id: user.id || 0
      }

      if (!isEditing) {
        await userService.createUser(entity);
        success('Sucesso', 'Usuário cadastrado com sucesso!');
      } else {
        await userService.updateUser(entity.id, entity);
        success('Sucesso', 'Usuário atualizado com sucesso!');
      }

      back();
    } catch (err) {
      if (!isEditing) {
        error('Erro', 'Erro ao cadastrar usuário!');
      } else {
        error('Erro', 'Erro ao atualizar usuário!');
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

  const onChange = ({ fileList: newFileList }) => {
    setUserImage(newFileList);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
      console.log(userImage)
    }, 0);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const switchChange = (value) => {
    if (!value) {
      setUserImage([]);
    }

    setShowImageUploader(value);
  }

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        {
          isEditing &&
          <h2>Editar usuário</h2>
        }
        {
          isDetails &&
          <h2>Detalhes do usuário</h2>
        }
        {
          (!isEditing && !isDetails) &&
          <h2>Cadastrar usuário</h2>
        }
      </div>
      {!isLoading &&
        <div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={user}
            size="large"
            validateMessages={validateMessages}
            disabled={isSubmitting || isDetails}
          >
            <Form.Item
              name="id_empresa"
              label='Empresa'
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select
                style={{ width: '100%' }}
                disabled={isDetails || (isEditing && user.id_empresa)}
                options={
                  companies.map((company) => {
                    return {
                      value: company.id,
                      label: company.nome
                    }
                  })
                }
              />
            </Form.Item>
            <Form.Item
              name="nome"
              rules={[
                {
                  required: true,
                },
              ]}
              label='Nome'
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                }
              ]}
              label='Email'
            >
              <Input prefix={<MailFilled />} />
            </Form.Item>
            {(!isEditing && !isDetails) &&
              <div className="dflex justify-content-between">
                <Form.Item
                  className="password-field"
                  name="senha"
                  rules={[
                    {
                      required: true,
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
                      required: true,
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
              </div>
            }
            <div className="dflex justify-content-between">
              <Form.Item
                style={{ width: '39%' }}
                name="dataNasc"
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Data de nascimento"
              >
                <DatePicker
                  style={{ width: '100%' }} format={dateFormatList} inputReadOnly placeholder='' />
              </Form.Item>
              <Form.Item
                style={{ width: '29%' }}
                name="sexo"
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Sexo"
              >
                <Select
                  style={{ width: '100%' }}
                  options={[
                    { value: 'm', label: 'Masculino' },
                    { value: 'f', label: 'Feminino' },
                    { value: 'o', label: 'Outro' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                style={{ width: '29%' }}
                name="telefone"
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Telefone"
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div className="dflex justify-space-between">
              <Form.Item
                name="cep"
                style={{ width: '20%' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="CEP"
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="rua"
                style={{ flex: 1, marginLeft: '10px' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Rua"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="dflex">
              <Form.Item
                name="numero"
                style={{ width: '20%' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Número"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="complemento"
                style={{ marginLeft: '10px', flex: 1 }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Complemento"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="dflex justify-content-between">
              <Form.Item
                name="bairro"
                style={{ width: '32%' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Bairro"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="cidade"
                style={{ width: '32%' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Cidade"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="estado"
                style={{ width: '32%' }}
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Estado"
              >
                <Input />
              </Form.Item>
            </div>
            {!isDetails &&
              <Form.Item valuePropName="permite_foto">
                <Switch onChange={switchChange} />
                <span style={{ marginLeft: '10px' }}>Capturar imagens</span>
              </Form.Item>
            }
            {showImageUploader &&
              <Form.Item>
                <ImgCrop rotationSlider>
                  <Upload
                    customRequest={dummyRequest}
                    listType="picture"
                    fileList={userImage}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    {userImage.length === 0 &&
                      <Button htmlType="button">
                        <CameraFilled />
                        <span>Adicionar foto</span>
                      </Button>
                    }
                  </Upload>
                </ImgCrop>
              </Form.Item>
            }
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