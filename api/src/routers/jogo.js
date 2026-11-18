const controller = require('../controllers/jogo');
const uploadImagem = require('../middleware/uploadImagem');

module.exports = (app) => {
    app.get('/jogo', controller.getJogo);
    app.post('/jogo', uploadImagem, controller.cadastroJogo);
    app.put('/jogo/:id', uploadImagem, controller.atualizarJogo);
    app.delete('/jogo/:id', controller.deletarJogo);
}