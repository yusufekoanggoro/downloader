const wrapper = require('../../../../../helpers/utils/wrapper');
const ytdl = require('ytdl-core');
const helper = require('../../utils/helpers');
const moment = require('moment-timezone');

class Youtube {
  async videoInfo (payload) {
    try {
      const { url } = payload;
      const info = await ytdl.getInfo(url);

      const time = moment().startOf('day')
        .seconds(info.videoDetails.lengthSeconds)
        .format('HH:mm:ss');
      const duration = `Duration: ${time}`;

      return wrapper.data({
        thumbnail: `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`,
        duration,
        title: info.videoDetails.title
      }, 'Success', 200);
    } catch (err) {
      return wrapper.error(err, err.message, 404);
    }
  }

  async download (payload, res) {
    const { url } = payload;
    const videoInfo = await this.videoInfo(payload);
    if (videoInfo.err) {
      return wrapper.response(res, 'fail', videoInfo.err, videoInfo.message);
    }
    const { title } = videoInfo.data;
    const stream = await helper.getStream(url, res);
    res.header('Content-Disposition', 'attachment; filename=' + title + ' by YUJA.mp3');
    res.header('Content-Type', 'audio/mpeg');
    return await helper.convertToMp3(stream, title, res);
  }
}

module.exports = Youtube;
