import { Request, Response } from "express";
import UsuarioService from "../Services/UsuarioService";
import EnderecoService from "../Services/EnderecoService";

class UsuarioController {
  usuarioService = UsuarioService;
  enderecoService = EnderecoService;

  public async index (request: Request, response: Response): Promise<Response> {
    let usuarios: any = await this.usuarioService.showAll(request.query);
    const total: any = usuarios[0].Total;
    return response.status(200).json({ users: usuarios, total });
  }

  public async show (request: Request, response: Response): Promise<Response> {
    const usuario: any = await this.usuarioService.show(request.params);
    return response.json(usuario[0]);
  }

  public async create (request: Request, response: Response): Promise<Response> {
    const result = await this.usuarioService.create(request.body);
    return response.json(result);
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    await this.usuarioService.edit(request.body);
    return response.json({});
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    const usuario = await this.usuarioService.show(request.params);
    await this.usuarioService.delete(request.params);
    await this.enderecoService.delete(usuario[0].id_endereco);
    return response.json({});
  }
}

export default new UsuarioController();
