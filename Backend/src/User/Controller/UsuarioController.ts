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
    let usuarios: any = await DataBaseConection.Executar("select", query);
    const total: any = usuarios[0].Total;
    return response.status(200).json({ users: usuarios, total });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const query = `
    SELECT U.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep
    FROM banco01.dbo.usuario U
    LEFT JOIN banco01.dbo.endereco E ON E.id = U.id_endereco
    WHERE U.id = ${request.params.id}
    `;

    const usuario: any = await DataBaseConection.Executar("select", query);

    return response.json(usuario[0]);
  }
}

export default new UsuarioController();
