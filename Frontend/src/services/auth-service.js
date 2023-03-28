import axios from "axios";

// TODO: adicionar url da API
const API_URL = "";

class AuthService {
  login(username, password) {
    return axios.post(API_URL + "/login", {
      username,
      password
    }).then(response => {
      if (response.data) {
        // TODO: Verificar se o objeto contém o token JWT e salvar o objeto no localStorage com a chave 'user'
      }

      return response.data;
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(/*TODO: a definir*/) {
    return axios.post(API_URL + "signup", {
      /*TODO: a definir*/
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

const authService = new AuthService();
export default authService;