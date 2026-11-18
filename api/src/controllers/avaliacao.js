const service = require('../services/avaliacao')

function validarDadosAvaliacao(body, exigirJogoId = false) {
    const nota = Number(body.nota)
    const anoAvaliacao = Number(body.ano_avaliacao)

    if (
        !Number.isInteger(nota) ||
        nota < 1 ||
        nota > 10 ||
        typeof body.comentario !== 'string' ||
        !body.comentario.trim() ||
        !Number.isInteger(anoAvaliacao) ||
        anoAvaliacao < 1 ||
        typeof body.gostei !== 'boolean' ||
        (exigirJogoId && (body.jogo_id === undefined || body.jogo_id === null))
    ) {
        return null
    }

    return {
        nota,
        comentario: body.comentario.trim(),
        ano_avaliacao: anoAvaliacao,
        gostei: body.gostei,
        ...(exigirJogoId && { jogo_id: body.jogo_id })
    }
}

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
        const dados = validarDadosAvaliacao(req.body || {}, true)
        if (!dados) {
            return res.status(400).json({
                status: 'error',
                message: 'Informe uma nota de 1 a 10, um comentário, o ano, se gostou e o jogo.'
            })
        }
        const result = await service.registrarAvaliacao(dados)
        return res.status(201).json({
            status: 'ok',
            message: 'Avaliação registrada com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        console.error('Erro ao registrar avaliação:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao registrar avaliação',
            error: error.message
        })
    }
}

async function atualizarAvaliacao(req, res) {
    try {
        const dados = validarDadosAvaliacao(req.body || {})
        if (!dados) {
            return res.status(400).json({
                status: 'error',
                message: 'Informe uma nota de 1 a 10, um comentário, o ano e se gostou.'
            })
        }

        const result = await service.atualizarAvaliacao(req.params.id, dados)
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Avaliação não encontrada'
            })
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Avaliação atualizada com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar avaliação',
            error: error.message
        })
    }
}

async function deletarAvaliacao(req, res) {
    try {
        const result = await service.deletarAvaliacao(req.params.id)
        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Avaliação não encontrada'
            })
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Avaliação excluída com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        console.error('Erro ao excluir avaliação:', error)
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao excluir avaliação',
            error: error.message
        })
    }
}

module.exports = {
    getAvaliacao,
    registrarAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao
}