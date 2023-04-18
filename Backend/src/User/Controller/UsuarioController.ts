import DataBaseConection from "../../lib/DataBaseConection";
import { Request, Response } from "express";

class UsuarioController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { take, skip } = request.query;
    const query = `
    SELECT id, nome, email, permite_foto, COUNT(*) OVER() as Total FROM banco01.dbo.usuario 
    ORDER BY nome
    
    `;
    // OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY
    let usuarios = await DataBaseConection.Executar("select", query);
    // const total: any = usuarios[0].Total;
    return response.status(200).json(usuarios);
  }
}

export default new UsuarioController();
