import { Request, Response } from "express";
import EquipamentoService from "../Services/EquipamentoService";

class EquipamentoController {
  public async index (request: Request, response: Response): Promise<Response> {
    let usuarios: any = await EquipamentoService.showAll(request.query);
    return response.status(200).json(usuarios);
  }

  public async create (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.create(request.body);
    return response.status(200).json({});
  }

  public async showAll (request: Request, response: Response): Promise<Response> {
    let equipamentos: any = await EquipamentoService.showAll(request.query);
    return response.status(200).json(equipamentos);
  }

  public async show (request: Request, response: Response): Promise<Response> {
    let equipamento = await EquipamentoService.show(request.params);
    return response.status(200).json(equipamento);
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.edit(request.body, request.params);
    return response.status(200).json({});
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    await EquipamentoService.delete(request.params);
    return response.status(200).json({});
  }
}

export default new EquipamentoController();