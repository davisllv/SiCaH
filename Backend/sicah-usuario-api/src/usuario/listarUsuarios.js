'use strict'

const { queryDb } = require('../lib/dbSql')

module.exports = async (req, res, next) => {
  try {
    const { take, skip } = req.query;
    const query = 'SELECT Usuario.id, Usuario.nome, email, permite_foto, Empresa.nome AS nome_empresa, COUNT(*) OVER() as Total FROM banco01.dbo.usuario Usuario ' +
      'LEFT JOIN banco01.dbo.empresa Empresa ON Empresa.id = Usuario.id_empresa ' +
      'ORDER BY nome ' +
      `OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    let usuarios = await queryDb('select', query);
    if (usuarios.mensagem) {
      return res.status(200).json({ users: [], total: 0 })
    }
    const total = usuarios[0].Total;
    return res.status(200).json({ users: usuarios, total })
  } catch (err) {
    return res.status(500).json({ erro: err })
  }
}