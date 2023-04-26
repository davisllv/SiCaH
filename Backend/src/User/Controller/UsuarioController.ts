import { Request, Response } from "express";
import UsuarioService from "../Services/UsuarioService";
import EnderecoService from "../Services/EnderecoService";

class UsuarioController {
  public async index (request: Request, response: Response): Promise<Response> {
    let usuarios: any = await UsuarioService.showAll(request.query);
    return response.status(200).json(usuarios);
  }

  public async show (request: Request, response: Response): Promise<Response> {
    const usuario: any = await UsuarioService.show(request.params);
    return response.status(200).json(usuario[0]);
  }

  public async create (request: Request, response: Response): Promise<Response> {
    const result = await UsuarioService.create(request.body);
    return response.status(200).json(result);
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    await UsuarioService.edit(request.body);
    return response.status(200).json({});
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    const usuario = await UsuarioService.show(request.params);
    await UsuarioService.delete(request.params);
    await EnderecoService.delete(usuario[0].id_endereco);
    return response.status(200).json({});
  }
}

export default new UsuarioController();
