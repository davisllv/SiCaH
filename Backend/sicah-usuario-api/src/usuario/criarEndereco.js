'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (data) => {
  try {
    let queryInsert = `INSERT INTO endereco (rua, numero, complemento, bairro, cidade, estado, cep) OUTPUT INSERTED.ID 
    VALUES(
        '${data.rua || ''}',
        '${data.numero || ''}',
        '${data.complemento || ''}',
        '${data.bairro || ''}',
        '${data.cidade || ''}',
        '${data.estado || ''}',
        '${data.cep || ''}'
    )`
    let output = await queryDb('insert', queryInsert);
    return output;
  } catch (err) {
    throw err;
  }
}