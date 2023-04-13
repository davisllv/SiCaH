import axios from "axios";
const API_URL = "http://localhost:3000";

class UserService {
  getUsers(take, skip) {
    return axios
      .get(API_URL + `/usuarios?skip=${skip}&take=${take}`)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => error);
  }

  createUser(user) {
    return axios.post(API_URL + "/usuario", user).catch((error) => error);
  }
  updateUser(id, user) {
    return axios.put(API_URL + "/usuario/" + id, user).catch((error) => error);
  }

  findUser(id) {
    return axios
      .get(API_URL + "/usuario/" + id)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => error);
  }

  deleteUser(id) {
    return axios.delete(API_URL + "/usuario/" + id).catch((error) => error);
  }
}

const userService = new UserService();
export default userService;
