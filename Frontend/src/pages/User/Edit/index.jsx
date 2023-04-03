import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Switch, Upload } from 'antd';
import { CameraFilled, LeftOutlined, LockFilled, MailFilled, SaveFilled, UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userImage, setUserImage] = useState([]);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 4000);
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

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        <h2>Cadastrar usuário</h2>
      </div>
      <div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          disabled={isLoading}
          size="large"
          validateMessages={validateMessages}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nome" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
              }
            ]}
          >
            <Input prefix={<MailFilled />} placeholder="Email" />
          </Form.Item>
          <div className="dflex justify-content-between">
            <Form.Item
              className="password-field"
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockFilled />} placeholder="Senha" />
            </Form.Item>
            <Form.Item
              className="password-field"
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("As senhas não são iguais"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockFilled />} placeholder="Confirmar senha" />
            </Form.Item>
          </div>
          <Form.Item valuePropName="checked">
            <Switch />
            <span style={{ marginLeft: '10px' }}>Capturar imagens</span>
          </Form.Item>
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
          <Form.Item>
            <div className="dflex">
              <Button htmlType="button" type="text" onClick={back}>
                <LeftOutlined />
                Voltar
              </Button>
              <Button htmlType="submit" type="primary" style={{ marginLeft: '10px' }}>
                <SaveFilled />
                Salvar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div >
  )
}