import axios from "axios";
const EMOTION_API_URL = "https://sicah-analysis.azurewebsites.net/api";

class EmotionService {
  getEmotion(data) {
    return axios.post(EMOTION_API_URL + `/detection`, data)
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      }).catch((error) => error);
  }
}

const emotionService = new EmotionService();
export default emotionService;