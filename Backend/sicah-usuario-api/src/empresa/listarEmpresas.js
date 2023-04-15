'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    const { take, skip } = req.query;
    let query = 'SELECT id, nome, cnpj,  COUNT(*) OVER() as Total FROM banco01.dbo.empresa ' +
      'ORDER BY nome ';

    if (take !== 'null') {
      query += `OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    }
    let empresas = await queryDb('select', query);
    if (empresas.mensagem) {
      return res.status(200).json({ companies: [], total: 0 });
    }

    const total = empresas[0].Total;
    return res.status(200).json({ companies: empresas, total })
  } catch (err) {
    return res.status(500).json({ erro: err })
  }
}