'use strict'

const { queryDb } = require('../lib/dbSql')
const criarEndereco = require('../endereco/criarEndereco')

module.exports = async (req, res, next) => {
  try {
    let output = await criarEndereco({ ...req.body });

    let queryInsert = `INSERT INTO empresa (nome, cnpj, id_endereco)
      VALUES('${req.body.nome}', '${req.body.cnpj}', '${output.recordset[0].ID}')`
    let empresas = await queryDb('insert', queryInsert);
    return res.status(200).json(empresas)
  } catch (err) {
    return res.status(400).json({ erro: err })
  }
}