const controller = require('../controllers/jogo');

module.exports = (app) => {
    app.get('/jogo', controller.getJogo);
    app.post('/jogo', controller.cadastroJogo);
    app.delete('/jogo/:id', controller.deletarJogo);
}