'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    let query = `UPDATE usuario  SET nome='${req.body.nome || ''}', cpf='${req.body.cpf || ''}', dataNasc='${req.body.dataNasc || ''}', ` +
      `sexo='${req.body.sexo || ''}', Email='${req.body.email || ''}', telefone='${req.body.telefone || ''}' WHERE id = ${req.params.id} `
    query += `UPDATE endereco SET rua='${req.body.rua || ''}', numero='${req.body.numero || ''}', complemento='${req.body.complemento || ''}', ` +
      `bairro='${req.body.bairro || ''}', cidade='${req.body.cidade || ''}', estado='${req.body.estado || ''}', cep='${req.body.cep || ''}' ` +
      `WHERE id = ${req.body.id_endereco}`;
    await queryDb('update', query);
    return res.status(200).json({});
  } catch (err) {
    console.log(err)
    return res.status(400).json({ erro: err })
  }
}