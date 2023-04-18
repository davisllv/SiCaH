'use strict'

const { queryDb } = require('../lib/dbSql')
const criarEndereco = require('../endereco/criarEndereco')

module.exports = async (req, res, next) => {
  try {
    let output = await criarEndereco({ ...req.body });

    let queryInsert = `INSERT INTO usuario (nome, nomeUsuario, senha, cpf, dataNasc, sexo, email, telefone, id_endereco, permite_foto, id_empresa)
      VALUES('${req.body.nome}', '${req.body.nomeUsuario || ""}', '${req.body.senha}', '${req.body.cpf || ""}', '${req.body.dataNasc || ""}', '${req.body.sexo || ""}', '${req.body.email || ""}', '${req.body.telefone || ""}', '${output.recordset[0].ID}', '${req.body.permite_foto || 0}', '${req.body.id_empresa || ""}')`
    let usuarios = await queryDb('insert', queryInsert);
    return res.status(200).json(usuarios)
  } catch (err) {
    return res.status(400).json({ erro: err })
  }
}