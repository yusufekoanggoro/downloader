const wrapper = require('../../../../../helpers/utils/wrapper');
const helper = require('../../utils/helpers');
const moment = require('moment-timezone');

class Youtube {
  async videoInfo (payload) {
    const { url } = payload;
    const videoInfo = await helper.getVideoInfo(url);
    if (videoInfo.err) {
      return wrapper.error(true, videoInfo.message, 200);
    }
    const { title, duration, thumbnail } = videoInfo.data;
    const time = moment().startOf('day')
      .seconds(duration)
      .format('HH:mm:ss');

    return wrapper.data({
      thumbnail,
      duration: `Duration: ${time}`,
      title
    }, 'Success', 200);
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

  async checkDownload (payload) {
    const { url } = payload;
    const checkDownload = await helper.prepareDownloadMp3(url)
  }
}

module.exports = Youtube;
