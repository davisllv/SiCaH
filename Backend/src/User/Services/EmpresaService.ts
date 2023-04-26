import DataBaseConection from '../../lib/DataBaseConection';
import EnderecoService from './EnderecoService';
class EmpresaService {
  public async showAll (data: any): Promise<any> {
    const { take, skip } = data;
    let query = 'SELECT id, nome, cnpj,  COUNT(*) OVER() as Total FROM banco01.dbo.empresa ' +
      'ORDER BY nome ';

    if (take !== 'null') {
      query += `OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    }
    let empresas = await DataBaseConection.Executar('select', query) as any;
    if (empresas.mensagem) {
      return { companies: [], total: 0 };
    }

    const total = empresas[0].Total;
    return { companies: empresas, total };
  }

  public async show (id: any): Promise<any> {
    const query = 'SELECT EMPRESA.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep\n' +
      'FROM banco01.dbo.empresa EMPRESA\n' +
      'LEFT JOIN banco01.dbo.endereco E ON E.id = EMPRESA.id_endereco\n' +
      `WHERE EMPRESA.id = ${id}`
    const empresa = await DataBaseConection.Executar('select', query) as Array<any>;
    return { ...empresa[0] };
  }

  public async create (data: any): Promise<any> {
    let output = await EnderecoService.create(data);
    let queryInsert = `INSERT INTO empresa (nome, cnpj, id_endereco)
      VALUES('${data.nome}', '${data.cnpj}', '${output.recordset[0].ID}')`
    await DataBaseConection.Executar('insert', queryInsert);
    return {};
  }

  public async edit (data: any, id: any): Promise<any> {
    const query = `UPDATE empresa SET nome='${data.nome || ''}', cnpj='${data.cnpj || ''}' WHERE id = ${id} ` +
      `UPDATE endereco SET rua='${data.rua || ''}', numero='${data.numero || ''}', complemento='${data.complemento || ''}', ` +
      `bairro='${data.bairro || ''}', cidade='${data.cidade || ''}', estado='${data.estado || ''}', cep='${data.cep || ''}' ` +
      `WHERE id = ${data.id_endereco}`;
    await DataBaseConection.Executar('update', query);
    return {};
  }

  public async autocomplete (data: any): Promise<any> {
    const { search } = data;
    if (search === 'undefined' || search === '') {
      return [];
    }

    const query = 'SELECT TOP(10) id, nome, cnpj FROM banco01.dbo.empresa ' +
      `WHERE nome LIKE '%${search}%'` +
      'ORDER BY nome';

    const resultado = await DataBaseConection.Executar('select', query);
    return resultado;
  }

  public async delete (id: any): Promise<any> {
    const empresa: any[] = await DataBaseConection.Executar('select', `SELECT id_endereco FROM empresa WHERE id = ${id}`) as Array<any>;
    let query = `DELETE empresa WHERE id = ${id}`
    await DataBaseConection.Executar('delete', query) as Array<any>;
    query = `DELETE endereco WHERE id = ${empresa[0].id_endereco}`;
    await DataBaseConection.Executar('delete', query);
    return {};
  }
}

export default new EmpresaService();