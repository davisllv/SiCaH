import axios from "axios";

// TODO: adicionar url da API
const API_URL = "http://localhost:3000";

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/usuario/login", {
      email,
      password
    }).then(response => {
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return { status: 200 };
    }).catch(error => {
      const response = {
        message: '',
        error: 404
      }
      if (error.message.includes('404')) {
        response.message = error.response.data.message;
      } else {
        console.log(error.message)
        response.message = 'Verifique sua conexão com a internet e tente novamente';
      }

      return response;
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

const authService = new AuthService();
export default authService;