import fetch from "node-fetch";

class EmocaoService {
  private apiUrl = "http://localhost:7156/api/DetectEmotion"

  public async detectEmotion (data: { userId: Number, base64: string }): Promise<any> {
    const request = {
      method: 'POST',
      body: JSON.stringify(data),
    }

    return await fetch(this.apiUrl, request);
  }
}

export default new EmocaoService();