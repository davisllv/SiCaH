import { Request, Response } from "express";
import EquipamentoService from "../Services/EquipamentoService";

class EnderecoController {

  public async create (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.create(request.body);
    return response.status(200).json({});
  }

  public async show (request: Request, response: Response): Promise<Response> {
    let empresa = await EquipamentoService.show(request.params.usuario);
    return response.status(200).json(empresa);
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.edit(request.body, request.params.id);
    return response.status(200).json({});
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.delete(request.params.id);
    return response.status(200).json({});
  }

}

export default new EnderecoController();