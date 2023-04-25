import { Request, Response } from "express";
import DataBaseConection from "../../lib/DataBaseConection";
import EnderecoController from "./EnderecoController";

class EmpresaController {
  public async show (request: Request, response: Response): Promise<Response> {
    const query = 'SELECT EMPRESA.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep\n' +
      'FROM banco01.dbo.empresa EMPRESA\n' +
      'LEFT JOIN banco01.dbo.endereco E ON E.id = EMPRESA.id_endereco\n' +
      `WHERE EMPRESA.id = ${request.params.id}`
    const empresa = await DataBaseConection.Executar('select', query) as Array<any>;
    return response.json({ ...empresa[0] })
  }

  public async index (request: Request, response: Response): Promise<Response> {
    const { take, skip } = request.query;
    let query = 'SELECT id, nome, cnpj,  COUNT(*) OVER() as Total FROM banco01.dbo.empresa ' +
      'ORDER BY nome ';

    if (take !== 'null') {
      query += `OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    }
    let empresas = await DataBaseConection.Executar('select', query) as any;
    if (empresas.mensagem) {
      return response.json({ companies: [], total: 0 });
    }

    const total = empresas[0].Total;
    return response.json({ companies: empresas, total })
  }

  public async create (request: Request, response: Response): Promise<Response> {
    let output = await EnderecoController.create({ ...request.body });
    let queryInsert = `INSERT INTO empresa (nome, cnpj, id_endereco)
      VALUES('${request.body.nome}', '${request.body.cnpj}', '${output.recordset[0].ID}')`
    let empresas = await DataBaseConection.Executar('insert', queryInsert);
    return response.json(empresas)
  }

  public async edit (request: Request, response: Response): Promise<Response> {
    const query = `UPDATE empresa SET nome='${request.body.nome || ''}', cnpj='${request.body.cnpj || ''}' WHERE id = ${request.params.id} ` +
      `UPDATE endereco SET rua='${request.body.rua || ''}', numero='${request.body.numero || ''}', complemento='${request.body.complemento || ''}', ` +
      `bairro='${request.body.bairro || ''}', cidade='${request.body.cidade || ''}', estado='${request.body.estado || ''}', cep='${request.body.cep || ''}' ` +
      `WHERE id = ${request.body.id_endereco}`;
    await DataBaseConection.Executar('update', query);
    return response.json({});
  }

  public async autocomplete (request: Request, response: Response): Promise<Response> {
    const { search } = request.params;
    if (search === 'undefined' || search === '') {
      return response.json([]);
    }

    const query = 'SELECT TOP(10) id, nome, cnpj FROM banco01.dbo.empresa ' +
      `WHERE nome LIKE '%${search}%'` +
      'ORDER BY nome';

    const resultado = await DataBaseConection.Executar('select', query);
    return response.json({ resultado });
  }

  public async delete (request: Request, response: Response): Promise<Response> {
    const empresa: any[] = await DataBaseConection.Executar('select', `SELECT id_endereco FROM empresa WHERE id = ${request.params.id}`) as Array<any>;
    let query = `DELETE empresa WHERE id = ${request.params.id}`
    const resultado = await DataBaseConection.Executar('delete', query) as Array<any>;
    query = `DELETE endereco WHERE id = ${empresa[0].id_endereco}`;
    await DataBaseConection.Executar('delete', query);
    return response.json(resultado);
  }
}

export default new EmpresaController();