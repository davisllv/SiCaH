'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
 try {
    let usuarios = await queryDb('select',`SELECT id FROM banco01.dbo.usuario WHERE id = ${req.params.id}`);
    return res.status(200).json(usuarios)
 } catch (e) {
    return res.status(400).json({ erro: e})
 }
}