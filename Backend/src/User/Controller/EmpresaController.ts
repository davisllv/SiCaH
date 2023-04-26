import { Request, Response } from "express";
import DataBaseConection from "../../lib/DataBaseConection";
import EnderecoController from "./EnderecoController";
import EmpresaService from "../Services/EmpresaService";

class EmpresaController {
  public async show (request: Request, response: Response): Promise<Response> {
    let empresa = await EmpresaService.show(request.params.id);
    return response.status(200).json(empresa);
  }

  public async index (request: Request, response: Response): Promise<Response> {
    let empresas = await EmpresaService.showAll(request.query);
    return response.status(200).json(empresas);
  }

  public async create (request: Request, response: Response): Promise<Response> {
    await EmpresaService.create(request.body);
    return response.status(200).json({});
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    await EmpresaService.edit(request.body, request.params.id)
    return response.status(200).json({});
  }

  public async autocomplete (request: Request, response: Response): Promise<Response> {
    let resultado = await EmpresaService.autocomplete(request.params);
    return response.status(200).json(resultado);
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    await EmpresaService.delete(request.params.id);
    return response.status(200).json({});
  }
}

export default new EmpresaController();