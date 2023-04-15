'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    let empresa = await queryDb('select', `SELECT id_endereco FROM empresa WHERE id = ${req.params.id}`);
    let query = `DELETE empresa WHERE id = ${req.params.id}`
    let empresas = await queryDb('delete', query);
    query = `DELETE endereco WHERE id = ${empresa[0].id_endereco}`;
    await queryDb('delete', query);
    return res.status(200).json(empresas)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ erro: err })
  }
}