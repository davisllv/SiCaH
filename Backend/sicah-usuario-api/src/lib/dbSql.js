const sql = require('mssql');

const config = {
    user: 'adminsql', // better stored in an app setting such as process.env.DB_USER
    password: '!%jGLd6ziB!z', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'dbsql02.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: "", // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'banco01', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

async function queryDb (tipo, query) {
    try {
        let connection = await sql.connect(config)
        let resultado = await connection.request().query(query)
        connection.close()
        if (tipo == 'select') {
            if (resultado.recordset.length > 0) {
                return resultado.recordset
            } else {
                return { mensagem: 'Não existem registros.' }
            }
        } else if (tipo == 'insert') {
            if (resultado.rowsAffected.length > 0) {
                return { mensagem: 'Registro inserido com sucesso.', ...resultado }
            } else {
                return { mensagem: 'Não foi possível criar o registro.' }
            }
        } else if (tipo == 'update') {
            if (resultado.rowsAffected.length > 0) {
                return { mensagem: 'Registro atualizado com sucesso.' }
            } else {
                return { mensagem: 'Não foi possível atualizar o registro.' }
            }
        } else if (tipo == 'delete') {
            if (resultado.rowsAffected.length > 0) {
                return { mensagem: 'Registro deletado com sucesso.' }
            } else {
                return { mensagem: 'Não foi possível deletar o registro.' }
            }
        } else {
            return { mensagem: 'Ocorreu algo inesperado na solicitação' }
        }


    } catch (err) {
        throw err;
    }
}

module.exports = { queryDb }