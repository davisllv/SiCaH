import axios from "axios";
const API_URL = "http://localhost:3000";

class CompanyService {
  getCompanies(take, skip) {
    return axios.get(API_URL + `/empresas?skip=${skip}&take=${take}`)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  createCompany(user) {
    return axios.post(API_URL + "/empresa", user).catch((error) => error);
  }

  updateCompany(id, user) {
    return axios.put(API_URL + "/empresa/" + id, user).catch((error) => error);
  }

  findCompany(id) {
    return axios.get(API_URL + "/empresa/" + id)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  deleteCompany(id) {
    return axios.delete(API_URL + "/empresa/" + id).catch((error) => error);
  }
}

const userService = new CompanyService();
export default userService;