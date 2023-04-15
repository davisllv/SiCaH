const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const app = express()
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.use(express.json())

app.get('/usuarios', require('./src/usuario/listarUsuarios'))
app.get('/usuario/:id', require('./src/usuario/listarUsuarioPorId'))
app.post('/usuario', require('./src/usuario/criarUsuario'))
app.put('/usuario/:id', require('./src/usuario/editarUsuario'))
app.delete('/usuario/:id', require('./src/usuario/excluirUsuario'))

app.get('/empresas', require('./src/empresa/listarEmpresas'))
app.get('/empresa/:id', require('./src/empresa/listarEmpresaPorId'))
app.post('/empresa', require('./src/empresa/criarEmpresa'))
app.put('/empresa/:id', require('./src/empresa/editarEmpresa'))
app.delete('/empresa/:id', require('./src/empresa/excluirEmpresa'))

app.use(function (req, res) {
  res.status(404).json({
    mensagem: 'Recurso não encontrado',
  })
})


app.listen(3000, function () {
  console.log('---------------------------------------------------------------------------------------------------------')
  console.log('Servidor da API iniciado na porta 3000 em ' + Date())
  console.log('---------------------------------------------------------------------------------------------------------')
})

