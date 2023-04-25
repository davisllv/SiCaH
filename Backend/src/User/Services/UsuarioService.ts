import DataBaseConection from "@src/lib/DataBaseConection";
import EnderecoController from "../Controller/EnderecoController";

class UsuarioService {
  public async showAll (data: any): Promise<any> {
    const { take, skip } = data.query;
    const query = `
    SELECT id, nome, email, permite_foto, COUNT(*) OVER() as Total FROM banco01.dbo.usuario 
    ORDER BY nome
    OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;

    let usuarios: any = await DataBaseConection.Executar("select", query);
    const total: any = usuarios[0].Total;
    return { users: usuarios, total };
  }

  public async show (data: any): Promise<any> {
    const query = `
    SELECT U.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep
    FROM banco01.dbo.usuario U
    LEFT JOIN banco01.dbo.endereco E ON E.id = U.id_endereco
    WHERE U.id = ${data.id}
    `;

    const usuario: any = await DataBaseConection.Executar("select", query);
    return usuario[0];
  }

  public async create (data: any): Promise<any> {
    const output = await EnderecoController.create({ ...data });
    const query = `INSERT INTO usuario (nome, nomeUsuario, senha, cpf, dataNasc, sexo, email, telefone, id_endereco, permite_foto, id_empresa)
      VALUES(
      '${data.nome}', 
      '${data.nomeUsuario || ""}',
      '${data.senha}', 
      '${data.cpf || ""}', 
      '${data.dataNasc || ""}', 
      '${data.sexo || ""}', 
      '${data.email || ""}', 
      '${data.telefone || ""}',
      '${output.recordset[0].ID}',
      '${data.permite_foto || 0}',
      '${data.id_empresa || ""}')`;

    const result = await DataBaseConection.Executar("insert", query);
    return result;
  }

  public async edit (data: any): Promise<{}> {
    let query = `UPDATE usuario  SET nome='${data.nome || ''}', cpf='${data.cpf || ''}', dataNasc='${data.dataNasc || ''}', ` +
      `sexo='${data.sexo || ''}', Email='${data.email || ''}', telefone='${data.telefone || ''}' WHERE id = ${data.id} ` +
      `UPDATE endereco SET rua='${data.rua || ''}', numero='${data.numero || ''}', complemento='${data.complemento || ''}', ` +
      `bairro='${data.bairro || ''}', cidade='${data.cidade || ''}', estado='${data.estado || ''}', cep='${data.cep || ''}' ` +
      `WHERE id = ${data.id_endereco}`;

    await DataBaseConection.Executar("update", query);
    return {};
  }

  public async delete (data: any): Promise<any> {
    const usuario = await DataBaseConection.Executar('select', `SELECT id_endereco FROM usuario WHERE id = ${data.id}`) as Array<any>;
    let query = `DELETE usuario WHERE id = ${data.id}`
    await DataBaseConection.Executar('delete', query) as Array<any>;
    query = `DELETE endereco WHERE id = ${usuario[0].id_endereco}`;
    await DataBaseConection.Executar('delete', query);
    return {};
  }
}

export default new UsuarioService();