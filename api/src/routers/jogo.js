const controller = require('../controllers/jogo');
const uploadImagem = require('../middleware/uploadImagem');

module.exports = (app) => {
    app.get('/jogo', controller.getJogo);
    app.post('/jogo', uploadImagem, controller.cadastroJogo);
    app.delete('/jogo/:id', controller.deletarJogo);
}