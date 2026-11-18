const db = require('../configs')

async function getAvaliacao(params){
    const {id} = params
    const sql = 'SELECT * FROM avaliacao'
    return await db.query(sql)
}

async function registrarAvaliacao(params) {
    const {nota, comentario, ano_avaliacao, gostei, jogo_id} = params
    const sql = 'INSERT INTO avaliacao (nota, comentario, ano_avaliacao, gostei, jogo_id, data_avaliacao, editado) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, FALSE) RETURNING *'
    return await db.query(sql, [nota, comentario, ano_avaliacao, gostei ? 1 : 0, jogo_id])
}

async function atualizarAvaliacao(id, params) {
    const {nota, comentario, ano_avaliacao, gostei} = params
    const sql = 'UPDATE avaliacao SET nota = $1, comentario = $2, ano_avaliacao = $3, gostei = $4, editado = TRUE WHERE id = $5 RETURNING *'
    return await db.query(sql, [nota, comentario, ano_avaliacao, gostei ? 1 : 0, id])
}

async function deletarAvaliacao(id) {
    const sql = 'DELETE FROM avaliacao WHERE id = $1 RETURNING *'
    return await db.query(sql, [id])
}

module.exports = {
    getAvaliacao,
    registrarAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao
}