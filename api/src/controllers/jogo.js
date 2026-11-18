const service = require('../services/jogo');

async function cadastroJogo(req, res) {
     try {
        const body = req.body || {};
        const camposObrigatorios = ['nome', 'resumo', 'desenvolvedora', 'ano_lancamento', 'plataforma'];
        const camposAusentes = camposObrigatorios.filter((campo) => {
            const valor = body[campo];
            return valor === undefined || valor === null || (typeof valor === 'string' && !valor.trim());
        });

        if(camposAusentes.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Campos obrigatórios ausentes: ${camposAusentes.join(', ')}`,
                camposAusentes
            })
        }
        const jogo = {
            ...body,
            imagem: req.file ? `/uploads/${req.file.filename}` : null
        };
        const result = await service.cadastroJogo(jogo)
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

async function atualizarJogo(req, res) {
    try {
        const dados = {
            ...req.body,
            imagem: req.file ? `/uploads/${req.file.filename}` : undefined
        }
        const result = await service.atualizarJogo(req.params.id, dados)

        if (result.rowCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Jogo não encontrado'
            })
        }

        return res.status(200).json({
            status: 'ok',
            message: 'Jogo atualizado com sucesso',
            data: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Erro ao atualizar jogo',
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
    atualizarJogo,
    deletarJogo
}