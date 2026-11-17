const db = require('../configs')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
async function getJogo(){
    const sql = 'SELECT * FROM jogo'
    const response = await db.query(sql);
    return response
}

async function cadastroJogo(params) {
    const {nome, resumo, desenvolvedora, ano_lancamento, plataforma, imagem} = params
    const sql = 'INSERT INTO jogo (nome, '
    + 'resumo,' 
    + 'desenvolvedora, '
    + 'ano_lancamento, '
    + 'plataforma, '
    + 'imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'

    return await db.query(sql, [nome, resumo, desenvolvedora, ano_lancamento, plataforma, imagem])
}

async function deletarJogo(params) {
    const {id} = params
    const sql = 'DELETE FROM jogo WHERE id = $1 RETURNING *'
    return await db.query(sql, [id])
}

module.exports = {
    cadastroJogo,
    getJogo,
    deletarJogo
}