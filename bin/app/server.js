const restify = require('restify');
const project = require('../../package.json');
const wrapper = require('../helpers/utils/wrapper');
const basicAuth = require('../auth/basic_auth_helper');
const youtubeHandler = require('../modules/youtube/v1/handlers/api_handler');

function AppServer () {
  this.server = restify.createServer({
    name: `${project.name}-server`,
    version: project.version
  });

  this.server.serverKey = '';
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser({requestBodyOnGet: true}));
  this.server.use(restify.plugins.authorizationParser());

  // required for basic auth
  this.server.use(basicAuth.init());

  // anonymous can access the end point, place code bellow
  this.server.get('/downloader/health-check', (req, res) => {
    wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
  });

  /*
    ====================
        Add new route
    ====================
  */
  this.server.get('/downloader/youtube/v1/video-info', youtubeHandler.videoInfo);
  this.server.get('/downloader/youtube/v1/download', youtubeHandler.download);

  process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });
  process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
}

module.exports = AppServer;
