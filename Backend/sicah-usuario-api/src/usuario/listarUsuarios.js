// 'use strict'

// const { queryDb } = require('../lib/DataBaseConection')

// module.exports = async (req, res, next) => {
//   try {
//     const { take, skip } = req.query;
//     const query = 'SELECT id, nome, email, permite_foto, COUNT(*) OVER() as Total FROM banco01.dbo.usuario ' +
//       'ORDER BY nome ' +
//       `OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
//     let usuarios = await queryDb('select', query);
//     const total = usuarios[0].Total;
//     return res.status(200).json({ users: usuarios, total })
//   } catch (err) {
//     return res.status(500).json({ erro: err })
//   }
// }