const controller = require('../controllers/avaliacao');

module.exports = (app) => {
    app.get('/avaliacao', controller.getAvaliacao);
    app.post('/avaliacao', controller.registrarAvaliacao);
}