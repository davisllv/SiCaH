'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
try {
    let queryInsert = `INSERT INTO usuario (id, Nome, NomeUsuario, Senha, cpf, DataNasc, Sexo, Email, Telefone, id_Endereco)
      VALUES((SELECT MAX(id) +1 FROM USUARIO), '${req.body.Nome}','${req.body.NomeUsuario}','${req.body.Senha}', '${req.body.cpf}', '${req.body.DataNasc}','${req.body.Sexo}', '${req.body.Email}', '${req.body.Telefone}', 0)`
    let usuarios = await queryDb('insert', queryInsert);
    return res.status(200).json(usuarios)
 } catch (err) {
    return res.status(400).json({ erro: err})
 }
}