import DataBaseConection from "../../lib/DataBaseConection";

class EquipamentoService {
  public async create (data: any): Promise<any> {
    const query = `
       INSERT INTO equipamento (Ip, Usuario, Senha, Descricao)
       VALUES ('${data.Ip || ''}', 
       '${data.Usuario || ''}', 
       '${data.Senha || ''}', 
       '${data.Descricao || ''}'
    )`;

    const output = await DataBaseConection.Executar("insert", query);
    return output;
  }

  public async show (data: any): Promise<any> {
    const query = `
    SELECT Ip, Descricao,Usuario, Senha FROM equipamento
    `;

    const usuario: any = await DataBaseConection.Executar("select", query);
    return usuario[0];
  }

  public async delete (id: any): Promise<any> {
    const query = `DELETE equipamento WHERE id = ${id}`;
    await DataBaseConection.Executar("delete", query);
    return {};
  }

  public async edit (data: any, id: any): Promise<{}> {
    let query = `UPDATE equipamento
            SET Ip = '${data.Ip || ''}', Usuario = '${data.Usuario || ''}', Senha = '${data.Senha || ''}', Descricao = '${data.Descricao || ''}'
            WHERE Id = '${id}'`;

    await DataBaseConection.Executar("update", query);
    return {};
  }
}



export default new EquipamentoService();