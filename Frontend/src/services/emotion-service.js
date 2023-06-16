import axios from "axios";
import { LOCAL_EMOTION_API_URL, REMOTE_EMOTION_API_URL } from "../helpers/constants";

// const API_URL = LOCAL_EMOTION_API_URL;
const API_URL = REMOTE_EMOTION_API_URL;

class EmotionService {
  getEmotion(data) {
    return axios.post(API_URL + `/detection`, data)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  getEmotionsReport(date, type) {
    return axios.get(API_URL + `/getemotionsreport?datetime=${date}&type=${type}`)
      .then((response) => {
        return response;
      }).catch((error) => error);
  }

  getDashboard() {
    return axios.get(API_URL + `/getdashboard`)
      .then((response) => {
        return response;
      }).catch((error) => error);
  }
}

const emotionService = new EmotionService();
export default emotionService;