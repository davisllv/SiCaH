import './style.css';
import { Link, useLocation } from 'react-router-dom';

export default function Menu() {
  const location = useLocation();
  if (location.pathname === '/login') {
    console.log('escondeu menu');
    return null;
  } else {
    return (
      <div className="menu-container dflex flex-column">
        <Link className="link" to={'/'}>Home</Link>
        <Link className="link">Relatórios</Link>
        <Link className="link">Análisar Imagem</Link>
        <Link className="link">Equipamentos</Link>
        <Link className="link" to={'user'}>Usuários</Link>
        <Link className="link">Integrações</Link>
      </div >
    );
  }
}