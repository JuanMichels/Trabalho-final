const db = require('../configs')

async function getAvaliacao(params){
    const {id} = params
    const sql = 'SELECT * FROM avaliacao'
    return await db.query(sql)
}

async function registrarAvaliacao(params) {
    const {nota, comentario, ano_avaliacao, gostei, jogo_id} = params
    const sql = 'INSERT INTO avaliacao (nota, comentario, ano_avaliacao, gostei, jogo_id) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    return await db.query(sql, [nota, comentario, ano_avaliacao, gostei, jogo_id])
}

module.exports = {
    getAvaliacao,
    registrarAvaliacao
}