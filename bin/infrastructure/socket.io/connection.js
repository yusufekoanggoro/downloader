const socketio = require('socket.io');
const logger = require('../../helpers/utils/logger');
const common = require('../../helpers/utils/common');
let socket;

const init = (server) => {
  socket = socketio(server.server, {
    cors: {
      origin: '*'
    }
  });
  socketEvents(socket);
};

const socketEvents = (socket) => {
  const users = [];
  socket.on('connection', client => {
    users.push({
      id: client.id
    });

    logger.log('socket', `${client.id} connected`, 'info');
    common.makeDirectoryInTmp(client.id);

    client.on('disconnect', async () => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === client.id) {
          users.splice(i, 1);
        }
      }

      common.deleteDirectoryInTmp(client.id);
      logger.log('socket', `${client.id} disconnect`, 'info');
      socket.emit('exit', users);
    });
  });
};

const getSocket = () => {
  // console.log(socket)
  return socket;
};

module.exports = {
  init,
  getSocket,
  socketEvents
};
