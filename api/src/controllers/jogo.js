const service = require('../services/jogo');

async function cadastroJogo(req, res) {
     try {
        if(!req.body.nome || !req.body.resumo || !req.body.desenvolvedora || !req.body.ano_lancamento || !req.body.plataforma) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos os campos são obrigatórios'
            })
        }
        const result = await service.cadastroJogo(req.body)
        return res.status(201).json({
            status: 'ok',
            message: 'Jogo cadastrado com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao cadastrar jogo',
            error: error.message
        })
    }
}

async function getJogo(req, res) {
    try {
        const result = await service.getJogo(req.params)
        return res.status(200).json({
            status: 'ok',
            data: result.rows
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar jogos',
            error: error.message
        })
    }   
}
async function deletarJogo(req, res) {
    try {
        const result = await service.deletarJogo(req.params)
        if(result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Jogo não encontrado'
            })
        }
        return res.status(200).json({
            status: 'ok',
            message: 'Jogo deletado com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao deletar jogo',
            error: error.message
        })
    }
}
module.exports = {
    getJogo,
    cadastroJogo,
    deletarJogo
}