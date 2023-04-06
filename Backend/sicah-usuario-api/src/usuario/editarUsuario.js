'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
try {
    let queryInsert = `UPDATE usuario
      SET Nome='${req.body.Nome}', NomeUsuario='${req.body.NomeUsuario}', Senha='${req.body.Senha}', cpf='${req.body.cpf}', DataNasc='${req.body.DataNasc}', Sexo='${req.body.Sexo}', Email='${req.body.Email}', Telefone='${req.body.Telefone}' 
      WHERE id = ${req.params.id}
      `
      console.log(queryInsert)
    let usuarios = await queryDb('update', queryInsert);
    return res.status(200).json(usuarios)
 } catch (err) {
   console.log(err)
    return res.status(400).json({ erro: err})
 }
}