import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { InfoCircleFill, PencilFill, PersonFillAdd, Trash2Fill, EmojiSmileFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import EmptyResult from '../../assets/empty-result.jpg';
import './style.css'

export default function User() {
  const navigation = useNavigate();
  const [users, setUsers] = useState([
    {
      name: 'Vinicius da Cruz Rodrigues Paulo',
      email: 'vinicius@sicah.com',
      captureImage: false,
      humor: 'smile'
    },
  ]);

  const handleUserHumor = (humor) => {
    if (humor === 'smile') {
      return <EmojiSmileFill />
    }
  }

  const navigateToCreate = () => {
    navigation('/create');
  }

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        <h2>Usuários</h2>
        <Button variant="light" onClick={navigateToCreate}>
          <div className="dflex align-items-center">
            <PersonFillAdd size={16} style={{ marginRight: '10px' }} />
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
        <Table striped bordered hover style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Permite capturar imagens</th>
              <th>Humor</th>
              <th style={{ width: '120px' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.captureImage}</td>
                <td>{handleUserHumor(user.humor)}</td>
                <td className="actions">
                  <OverlayTrigger
                    key={user.id}
                    placement='top'
                    overlay={
                      <Tooltip>
                        Detalhes
                      </Tooltip>
                    }
                  >
                    <InfoCircleFill size={16} />
                  </OverlayTrigger>
                  <OverlayTrigger
                    key={user.id}
                    placement='top'
                    overlay={
                      <Tooltip>
                        Editar
                      </Tooltip>
                    }
                  >
                    <PencilFill size={16} />
                  </OverlayTrigger>
                  <OverlayTrigger
                    key={user.id}
                    placement='top'
                    overlay={
                      <Tooltip>
                        Remover
                      </Tooltip>
                    }
                  >
                    <Trash2Fill size={16} />
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
    </div>
  )
}