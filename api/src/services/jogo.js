const db = require('../configs')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
async function getJogo(){
    const sql = 'SELECT * FROM jogo ORDER BY id ASC'
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

async function atualizarJogo(id, params) {
    const { nome, resumo, desenvolvedora, ano_lancamento, plataforma, imagem } = params
    const sql = imagem
        ? 'UPDATE jogo SET nome = $1, resumo = $2, desenvolvedora = $3, ano_lancamento = $4, plataforma = $5, imagem = $6 WHERE id = $7 RETURNING *'
        : 'UPDATE jogo SET nome = $1, resumo = $2, desenvolvedora = $3, ano_lancamento = $4, plataforma = $5 WHERE id = $6 RETURNING *'
    const values = imagem
        ? [nome, resumo, desenvolvedora, ano_lancamento, plataforma, imagem, id]
        : [nome, resumo, desenvolvedora, ano_lancamento, plataforma, id]

    return await db.query(sql, values)
}

module.exports = {
    cadastroJogo,
    getJogo,
    atualizarJogo,
    deletarJogo
}