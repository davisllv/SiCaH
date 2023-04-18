'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
   try {
      const query = 'SELECT U.*, E.rua, E.numero, E.complemento, E.bairro, E.cidade, E.estado, E.cep\n' +
         'FROM banco01.dbo.usuario U\n' +
         'LEFT JOIN banco01.dbo.endereco E ON E.id = U.id_endereco\n' +
         `WHERE U.id = ${req.params.id}`
      let usuario = await queryDb('select', query);
      return res.status(200).json({ ...usuario[0], senha: '' })
   } catch (e) {
      return res.status(400).json({ erro: e })
   }
}