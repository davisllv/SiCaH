import DataBaseConection from "../../lib/DataBaseConection";

class EnderecoController {
  public async create (data: any): Promise<any> {
    const query = `
        INSERT INTO endereco (rua, numero, complemento, bairro, cidade, estado, cep) OUTPUT INSERTED.ID
        VALUES(
        '${data.rua || ''}',
        '${data.numero || ''}',
        '${data.complemento || ''}',
        '${data.bairro || ''}',
        '${data.cidade || ''}',
        '${data.estado || ''}',
        '${data.cep || ''}'
    )
  `;

    const output = await DataBaseConection.Executar("insert", query);
    return output;
  }
}

export default new EnderecoController();