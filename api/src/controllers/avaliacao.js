const service = require('../services/avaliacao')

async function getAvaliacao(req, res) {
    try {
        const result = await service.getAvaliacao(req.query)
        return res.status(200).json({
            status: 'ok',
            data: result.rows
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao buscar avaliações',
            error: error.message
        })
    }
}

async function registrarAvaliacao(req, res) {
    try {
        if(!req.body.nota || !req.body.comentario || !req.body.ano_avaliacao || !req.body.gostei || !req.body.jogo_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos os campos são obrigatórios'
            })
        }
        const result = await service.registrarAvaliacao(req.body)
        return res.status(201).json({
            status: 'ok',
            message: 'Avaliação registrada com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao registrar avaliação',
            error: error.message
        })
    }
}
module.exports = {
    getAvaliacao,
    registrarAvaliacao
}