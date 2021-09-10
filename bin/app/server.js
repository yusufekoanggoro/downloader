const restify = require('restify');
const project = require('../../package.json');
const wrapper = require('../helpers/utils/wrapper');
const basicAuth = require('../auth/basic_auth_helper');
const youtubeHandler = require('../modules/youtube/v1/handlers/api_handler');
const corsMiddleware = require('restify-cors-middleware');
const socketio = require('socket.io');
const logger = require('../helpers/utils/logger');

function AppServer () {
  this.server = restify.createServer({
    name: `${project.name}-server`,
    version: project.version
  });

  this.socket = socketio(this.server.server, {
    cors: {
      origin: '*'
    }
  });

  this.server.serverKey = '';
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser({ requestBodyOnGet: true }));
  this.server.use(restify.plugins.authorizationParser());
  // required for CORS configuration
  const corsConfig = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    // ['*'] -> to expose all header, any type header will be allow to access
    // X-Requested-With,content-type,GET, POST, PUT, PATCH, DELETE, OPTIONS -> header type
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
  });
  this.server.pre(corsConfig.preflight);
  this.server.use(corsConfig.actual);

  // required for basic auth
  this.server.use(basicAuth.init());

  // anonymous can access the end point, place code bellow
  this.server.get('/', (req, res) => {
    wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
  });

  /*
    ====================
        Add new route
    ====================
  */
  this.server.get('/youtube/v1/video-info', basicAuth.isAuthenticated, youtubeHandler.videoInfo);
  this.server.get('/youtube/v1/download', basicAuth.isAuthenticated, youtubeHandler.download);
  this.server.get('/youtube/v1/check-download', basicAuth.isAuthenticated, youtubeHandler.checkDownload);
  this.server.del('/youtube/v1/:filename', basicAuth.isAuthenticated, youtubeHandler.deleteFile);

  const users = [];
  this.socket.on('connection', client => {
    users.push({
      id: client.id
    });
    logger.log('socket', `${client.id} connected`, 'info');

    client.on('disconnect', () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === client.id) {
          users.splice(i, 1);
        }
      }
      logger.log('socket', `${client.id} disconnect`, 'info');
      this.socket.emit('exit', users);
    });
  });
}

module.exports = AppServer;
