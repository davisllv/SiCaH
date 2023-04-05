'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
try {
    let usuarios = await queryDb('select','SELECT id, Nome, NomeUsuario, Senha, cpf, DataNasc, Sexo, Email, Telefone, id_Endereco FROM banco01.dbo.usuario');
    return res.status(200).json(usuarios)
 } catch (err) {
    return res.status(500).json({ erro: err})
 }
}