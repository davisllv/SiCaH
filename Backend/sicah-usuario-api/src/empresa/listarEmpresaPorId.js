'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    const query = 'SELECT EMPRESA.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep\n' +
      'FROM banco01.dbo.empresa EMPRESA\n' +
      'LEFT JOIN banco01.dbo.endereco E ON E.id = EMPRESA.id_endereco\n' +
      `WHERE EMPRESA.id = ${req.params.id}`
    let empresa = await queryDb('select', query);
    return res.status(200).json({ ...empresa[0] })
  } catch (e) {
    return res.status(400).json({ erro: e })
  }
}