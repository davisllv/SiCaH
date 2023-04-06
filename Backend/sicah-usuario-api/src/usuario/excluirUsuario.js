'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    let usuario = await queryDb('select', `SELECT id_endereco FROM usuario WHERE id = ${req.params.id}`);
    let query = `DELETE usuario WHERE id = ${req.params.id}`
    let usuarios = await queryDb('delete', query);
    query = `DELETE endereco WHERE id = ${usuario[0].id_endereco}`;
    await queryDb('delete', query);
    return res.status(200).json(usuarios)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ erro: err })
  }
}