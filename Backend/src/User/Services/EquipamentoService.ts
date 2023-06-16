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

  public async showAll (data: any): Promise<any> {
    const { take, skip } = data;
    const query = `SELECT Id, Ip, Usuario, Senha, Descricao, COUNT(*) OVER() as Total FROM banco01.dbo.Equipamento 
    ORDER BY id
    OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    let equipamentos: any = await DataBaseConection.Executar("select", query);
    const total: any = equipamentos[0]?.Total || 0;
    if (Array.isArray(equipamentos)) {
      return { equipaments: equipamentos || [], total };
    } else {
      return { equipaments: [], total: 0 };
    }
  }

  public async show (data: any): Promise<any> {
    const query = `SELECT id, Ip, Descricao, Usuario, Senha FROM equipamento WHERE id = ${data.id}`;
    const equipamento: any = await DataBaseConection.Executar("select", query);

    delete equipamento[0].Senha;
    return equipamento[0];
  }

  public async delete (data: any): Promise<any> {
    const query = `DELETE equipamento WHERE id = ${data.id}`;
    await DataBaseConection.Executar("delete", query);
    return {};
  }

  public async edit (data: any, requestParams: any): Promise<{}> {
    let query = `UPDATE equipamento
      SET Ip = '${data.Ip || ''}', Usuario = '${data.Usuario || ''}', Descricao = '${data.Descricao || ''}'
      WHERE Id = '${requestParams.id}'`;

    await DataBaseConection.Executar("update", query);
    if (data.Senha) {
      query = `UPDATE equipamento
      SET Senha = '${data.Senha}'
      WHERE Id = '${requestParams.id}'`;
      await DataBaseConection.Executar("update", query);
    }

    return {};
  }
}



export default new EquipamentoService();