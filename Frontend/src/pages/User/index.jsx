import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Info, PencilFill, PersonFillAdd } from 'react-bootstrap-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import EmptyResult from '../../assets/empty-result.jpg';
import './style.css'

export default function User() {
  const [users, setUsers] = useState([
    {
      name: 'Vinicius da Cruz Rodrigues Paulo',
      email: 'vinicius@sicah.com',
      captureImage: false,
      humor: ''
    }
  ]);

  return (
    <div className="user-container">
      <div className="dflex justify-content-between">
        <h2>Usuários</h2>
        <Button variant="light">
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Permite capturar imagens</th>
              <th>Humor</th>
              <th style={{ width: '90px' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.captureImage}</td>
                <td>{user.humor}</td>
                <td>
                  <OverlayTrigger
                    key={user.id}
                    placement='top'
                    overlay={
                      <Tooltip>
                        Detalhes
                      </Tooltip>
                    }
                  >
                    <Info size={16} style={{ marginRight: '20px', marginLeft: '10px' }} />
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
                    <PencilFill size={16} style={{ marginRight: '10px' }} />
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