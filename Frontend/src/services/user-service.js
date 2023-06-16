import axios from "axios";
import authHeader from "./auth-header";
import { LOCAL_API_URL, REMOTE_API_URL } from "../helpers/constants";

// const API_URL = LOCAL_API_URL;
const API_URL = REMOTE_API_URL;

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
      }).catch((error) => {
        if (error.message.includes('401')) {
          localStorage.clear();
          window.location.reload();
        }

        return error;
      });
  }

  createUser(user) {
    return axios.post(API_URL + "/usuario", user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  updateUser(id, user) {
    return axios.put(API_URL + "/usuario/" + id, user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  findUser(id) {
    return axios.get(API_URL + "/usuario/" + id, {
      headers: authHeader()
    })
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => {
        if (error.message.includes('401')) {
          localStorage.clear();
          window.location.reload();
        }

        return error;
      });
  }

  deleteUser(id) {
    return axios.delete(API_URL + "/usuario/" + id, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }
}

const userService = new UserService();
export default userService;