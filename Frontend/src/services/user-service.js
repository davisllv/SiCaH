import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "https://apisicah.azurewebsites.net";

class UserService {
  getUsers(take, skip, companyId) {
    return axios.get(API_URL + `/usuario?skip=${skip}&take=${take}&companyId=${companyId}`, {
      headers: authHeader()
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Usuário não autenticado");
        }
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  createUser(user) {
    return axios.post(API_URL + "/usuario", user, {
      headers: authHeader()
    }).catch((error) => error);
  }

  updateUser(id, user) {
    return axios.put(API_URL + "/usuario/" + id, user, {
      headers: authHeader()
    }).catch((error) => error);
  }

  findUser(id) {
    return axios.get(API_URL + "/usuario/" + id, {
      headers: authHeader()
    })
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  deleteUser(id) {
    return axios.delete(API_URL + "/usuario/" + id, {
      headers: authHeader()
    }).catch((error) => error);
  }
}

const userService = new UserService();
export default userService;