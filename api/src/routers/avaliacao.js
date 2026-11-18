const controller = require('../controllers/avaliacao');

module.exports = (app) => {
    app.get('/avaliacao', controller.getAvaliacao);
    app.post('/avaliacao', controller.registrarAvaliacao);
    app.put('/avaliacao/:id', controller.atualizarAvaliacao);
    app.delete('/avaliacao/:id', controller.deletarAvaliacao);
}