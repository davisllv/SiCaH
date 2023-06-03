import { Request, Response } from "express";
import EmocaoService from "../Services/EmocaoService";

class EmocaoController {
  public async detectEmotion (request: Request, response: Response): Promise<any> {
    let emocao = await EmocaoService.detectEmotion(request.body);
    if (typeof emocao === 'string') {
      return response.status(400).json(emocao);
    }

    return response.status(200).json(emocao);
  }
}