const ytdl = require('ytdl-core');
const logger = require('../../../../helpers/utils/logger');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

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
    });
    return resolve(stream);
  });
};

const convertToMp3 = async (stream, title, res) => {
  return new Promise((resolve, reject) => {
    ffmpeg({ source: stream })
      .toFormat('mp3')
      .on('error', (err) => {
        logger.log('error', err.message);
        reject(err);
      })
      .on('end', () => {
        logger.log('convertToMp3', 'Successfully download audio!');
        resolve();
      })
      .pipe(res, { end: true });
  });
};

module.exports = {
  getInfo,
  getStream,
  convertToMp3
};
