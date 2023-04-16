'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.params;

    if (search === 'undefined' || search === '') {
      return res.status(200).json([]);
    }

    let query = 'SELECT TOP(10) id, nome, cnpj FROM banco01.dbo.empresa ' +
      `WHERE nome LIKE '%${search}%'` +
      'ORDER BY nome';

    let empresas = await queryDb('select', query);
    return res.status(200).json({ empresas })
  } catch (err) {
    return res.status(500).json({ erro: err })
  }
}