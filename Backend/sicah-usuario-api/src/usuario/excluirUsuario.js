'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
try {
    let queryInsert = `DELETE usuario WHERE id = ${req.params.id}`
      console.log(queryInsert)
    let usuarios = await queryDb('delete', queryInsert);
    return res.status(200).json(usuarios)
 } catch (err) {
   console.log(err)
    return res.status(400).json({ erro: err})
 }
}