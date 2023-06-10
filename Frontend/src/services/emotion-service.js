import axios from "axios";
const EMOTION_API_URL = "http://localhost:7156/api";

class EmotionService {
  getEmotion(data) {
    return axios.post(EMOTION_API_URL + `/detection`, data)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }

  getEmotionsReport(date, type) {
    return axios.get(EMOTION_API_URL + `/getemotionsreport?datetime=${date}&type=${type}`)
      .then((response) => {
        return response;
      }).catch((error) => error);
  }
}

const emotionService = new EmotionService();
export default emotionService;