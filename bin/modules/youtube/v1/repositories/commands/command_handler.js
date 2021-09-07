const Youtube = require('./domain');

const videoInfo = async (payload) => {
  const youtube = new Youtube();
  const postCommand = async payload => youtube.videoInfo(payload);
  return postCommand(payload);
};

const download = async (payload, res) => {
  const youtube = new Youtube();
  const postCommand = async (payload, res) => youtube.download(payload, res);
  return postCommand(payload, res);
};

module.exports = {
  videoInfo,
  download
};
