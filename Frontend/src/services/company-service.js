import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "https://apisicah.azurewebsites.net";

class CompanyService {
  getCompanies(take, skip) {
    return axios.get(API_URL + `/empresa?skip=${skip}&take=${take}`, {
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

  createCompany(user) {
    return axios.post(API_URL + "/empresa", user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  updateCompany(id, user) {
    return axios.put(API_URL + "/empresa/" + id, user, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  findCompany(id) {
    return axios.get(API_URL + "/empresa/" + id, {
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

  deleteCompany(id) {
    return axios.delete(API_URL + "/empresa/" + id, {
      headers: authHeader()
    }).catch((error) => {
      if (error.message.includes('401')) {
        localStorage.clear();
        window.location.reload();
      }

      return error;
    });
  }

  getAutocomplete(nome) {
    return axios.get(API_URL + "/empresa/autocomplete/" + nome, {
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
}

const userService = new CompanyService();
export default userService;