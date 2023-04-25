import DataBaseConection from "@src/lib/DataBaseConection";

class EnderecoService {
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

  public async delete (id: any): Promise<any> {
    const query = `DELETE endereco WHERE id = ${id}`;
    await DataBaseConection.Executar("delete", query);
    return {};
  }
}

export default new EnderecoService();