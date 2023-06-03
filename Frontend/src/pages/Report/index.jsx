import './style.css';
import { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons/lib/icons';
import { App, List, Form } from 'antd';
import Dragger from 'antd/es/upload/Dragger';

export default function Report() {
  const [emotions, setEmotions] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const { notification } = App.useApp();
  const emotionApiUrl = 'https://sicah-analysis.azurewebsites.net/api/DetectEmotion';

  const onImageChange = (data) => {
    setSelectedImage(data.fileList);
    if (data.file.status === 'done') {
      notification.success({
        message: 'Sucesso',
        description: 'Veja abaixo o resultado da análise da imagem',
      });

      setEmotions(data.file.response);
    }
    if (data.file.status === 'error') {
      notification.error({
        message: 'Erro',
        description: 'Erro ao análisar imagem',
      });

      setEmotions(data.file.response);
    }
  }

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

  const props = {
    name: 'file',
    action: emotionApiUrl,
    multiple: false,
  };

  return (
    <div className="user-container">
      <div className="dflex">
        <h2>Relatórios</h2>
      </div>
      <div className="face-container flex-column">
        <Form
          layout="vertical"
          className="login_form"
          size="large"
        >
          <Form.Item>
            <Dragger {...props} onPreview={onPreview} onChange={onImageChange} fileList={selectedImage} listType="picture">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Clique ou arraste para cá a imagem a ser analisada</p>
            </Dragger>
          </Form.Item>
        </Form>
        {emotions.length > 0 &&
          <List style={{ width: '40%' }}
            header={<h3>Resultado da análise</h3>}
            itemLayout="vertical"
            dataSource={emotions}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={null}
                  title={item.emotion}
                  description={'Confiança: ' + item.confidence + '%'}
                />
              </List.Item>
            )}
          />
        }
      </div>
    </div>
  )
}