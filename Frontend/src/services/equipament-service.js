import axios from "axios";
import authHeader from "./auth-header";
import { LOCAL_API_URL, REMOTE_API_URL } from "../helpers/constants";

// const API_URL = LOCAL_API_URL;
const API_URL = REMOTE_API_URL;

class EquipamentService {
  getUsers(take, skip, companyId) {
    return axios.get(API_URL + `/equipamento?skip=${skip}&take=${take}&companyId=${companyId}`, {
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

  createEquipament(user) {
    return axios.post(API_URL + "/equipamento", user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  updateEquipament(id, user) {
    return axios.put(API_URL + "/equipamento/" + id, user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  findEquipament(id) {
    return axios.get(API_URL + "/equipamento/" + id, {
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

  deleteEquipament(id) {
    return axios.delete(API_URL + "/equipamento/" + id, {
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

const userService = new EquipamentService();
export default userService;