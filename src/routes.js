const {helloHandler} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: helloHandler,
  },
];
module.exports = routes;
