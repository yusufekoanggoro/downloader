const ytdl = require('ytdl-core');
const logger = require('../../../../helpers/utils/logger');
const ffmpeg = require('fluent-ffmpeg');
const wrapper = require('../../../../helpers/utils/wrapper');

const getInfo = async (url) => {
  const response = await ytdl.getBasicInfo(url);
  const info = response.videoDetails.title;
  return info;
};

const getStream = async (url, res) => {
  logger.log('getStream', `Downloading from ${url} ...`);
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, {
      quality: 'highest',
      filter: (format) => format.container === 'mp4'
    }).on('end', () => {
      logger.log('getStream', 'Successfully downloaded the stream!');
    }).on('error', (err) => {
      logger.log('getStream', err.message);
      return wrapper.response(res, 'fail', err);
    });
    return resolve(stream);
  });
};

const convertToMp3 = async (stream, title, res) => {
  return new Promise((resolve, reject) => {
    const proc = ffmpeg({ source: stream })
      .toFormat('mp3')
      .output(res)
      .on('error', (err) => {
        return wrapper.response(res, 'fail', err);
      })
      .run();
    return resolve(proc);
  });
};

module.exports = {
  getInfo,
  getStream,
  convertToMp3
};
