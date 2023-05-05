/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const rota = "http://localhost:3000/usuario/login";

class LoginService {
  async store({ params }) {
    const response = await axios.post(rota, params);

    return response;
  }
}

export default new LoginService();
