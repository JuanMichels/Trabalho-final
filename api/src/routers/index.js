const jogoRoute = require('./jogo');
const avaliacaoRoute = require('./avaliacao');

module.exports = (app) => {
  jogoRoute(app);
  avaliacaoRoute(app);
}   