const ytdl = require('ytdl-core');
const logger = require('../../../../helpers/utils/logger');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const youtubedl = require('youtube-dl-exec');
const wrapper = require('../../../../helpers/utils/wrapper');
const path = require('path')

const getVideoInfo = async (url) => {
  try {
    const response = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: url
    });
    return wrapper.data(response, 'success', 200);
  } catch (error) {
    const err = JSON.parse(JSON.stringify(error));
    return wrapper.error('fail', err.stderr, 500);
  }
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
      })
      .on('end', () => {
        logger.log('convertToMp3', 'Successfully downloaded the audio!');
        resolve();
      })
      .on('close', () => {
        logger.log('convertToMp3', 'stream closed', 'info');
      })
      .pipe(res, { end: true });
  });
};

const prepareDownloadMp3 = async (url) => {
  try {
    let reqPath = path.join(__dirname, '../../../../../tmp');
    const response = await youtubedl.raw(url, {
      format:18
    }, { cwd: reqPath })
    // console.log(response)
    // dumpSingleJson: true,
    // noWarnings: true,
    // noCallHome: true,
    // noCheckCertificate: true,
    // preferFreeFormats: true,
    // youtubeSkipDashManifest: true,
    // referer: 'https://example.com'
    response.on('info', function(info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)
    })
    
    response.pipe(fs.createWriteStream('myvideo.mp4'))
    
  } catch (error) {
    const err = JSON.parse(JSON.stringify(error));
    return wrapper.error('fail', err.stderr, 500);
  }
}

module.exports = {
  getVideoInfo,
  getStream,
  convertToMp3,
  prepareDownloadMp3
};
