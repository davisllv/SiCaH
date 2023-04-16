/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin, App } from 'antd';
import { LeftOutlined, SaveFilled, LoadingOutlined, BankOutlined, IdcardOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import companyService from '../../../services/company-service';
dayjs.extend(customParseFormat);

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDetails, setIsDetails] = useState(false);
  const [company, setCompany] = useState({});
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  useEffect(() => {
    const { pathname } = window.location;
    if (pathname.includes('edit') || pathname.includes('details')) {
      if (pathname.includes('edit')) {
        setIsEditing(true);
      } else {
        setIsDetails(true);
      }
      setIsLoading(true);
      findCompany(pathname.split('/').pop());
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

  const findCompany = (id) => {
    companyService.findCompany(id).then((response) => {
      setCompany(response);
      form.setFieldsValue({
        ...response,
        dataNasc: dayjs(response.dataNasc)
      })
      setIsLoading(false);
    })
  }

  const onFinish = async (entity) => {
    try {
      setIsSubmitting(true);
      entity = {
        ...entity,
        dataNasc: entity.dataNasc?.toDate().toISOString() || '',
        id_endereco: company.id_endereco || 0,
        id: company.id || 0
      }

      if (!isEditing) {
        await companyService.createCompany(entity);
        success('Sucesso', 'Empresa cadastrada com sucesso!');
      } else {
        await companyService.updateCompany(entity.id, entity);
        success('Sucesso', 'Empresa atualizada com sucesso!');
      }

      back();
    } catch (err) {
      if (!isEditing) {
        error('Erro', 'Erro ao cadastrar empresa!');
      } else {
        error('Erro', 'Erro ao atualizar empresa!');
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
  };

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        {
          isEditing &&
          <h2>Editar empresa</h2>
        }
        {
          isDetails &&
          <h2>Detalhes da empresa</h2>
        }
        {
          (!isEditing && !isDetails) &&
          <h2>Cadastrar empresa</h2>
        }
      </div>
      {!isLoading &&
        <div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={company}
            size="large"
            validateMessages={validateMessages}
            disabled={isSubmitting || isDetails}
          >
            <Form.Item
              name="nome"
              rules={[
                {
                  required: true,
                },
              ]}
              label='Nome'
            >
              <Input prefix={<BankOutlined />} />
            </Form.Item>
            <div className="dflex justify-content-between">
              <Form.Item
                style={{ width: '49%' }}
                name="cnpj"
                rules={[
                  {
                    required: true,
                  },
                  {
                    message: "Cnpj inválido",
                    validator: (_, cnpj) => {
                      if (!cnpj) {
                        return Promise.resolve();
                      }

                      if (cnpj && cnpj.length !== 14) {
                        return Promise.reject();
                      }

                      // Elimina CNPJs invalidos conhecidos
                      if (cnpj === "00000000000000" ||
                        cnpj === "11111111111111" ||
                        cnpj === "22222222222222" ||
                        cnpj === "33333333333333" ||
                        cnpj === "44444444444444" ||
                        cnpj === "55555555555555" ||
                        cnpj === "66666666666666" ||
                        cnpj === "77777777777777" ||
                        cnpj === "88888888888888" ||
                        cnpj === "99999999999999")
                        return Promise.reject();

                      // Valida DVs
                      let tamanho = cnpj.length - 2
                      let numeros = cnpj.substring(0, tamanho);
                      let digitos = cnpj.substring(tamanho);
                      let soma = 0;
                      let pos = tamanho - 7;
                      for (let i = tamanho; i >= 1; i--) {
                        soma += numeros.charAt(tamanho - i) * pos--;
                        if (pos < 2)
                          pos = 9;
                      }

                      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                      if (resultado.toString() !== digitos.charAt(0)) {
                        return Promise.reject();
                      }

                      tamanho = tamanho + 1;
                      numeros = cnpj.substring(0, tamanho);
                      soma = 0;
                      pos = tamanho - 7;
                      for (let i = tamanho; i >= 1; i--) {
                        soma += numeros.charAt(tamanho - i) * pos--;
                        if (pos < 2)
                          pos = 9;
                      }

                      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                      if (resultado.toString() !== digitos.charAt(1)) {
                        return Promise.reject();
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
                label='CNPJ'
              >
                <Input maxLength={14} minLength={14} prefix={<IdcardOutlined />} />
              </Form.Item>
              <Form.Item
                style={{ width: '49%' }}
                name="telefone"
                rules={[
                  {
                    required: false,
                  }
                ]}
                label="Telefone"
              >
                <Input prefix={<PhoneOutlined />} />
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
      {isLoading &&
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