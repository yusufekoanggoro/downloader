const wrapper = require('../../../../../helpers/utils/wrapper');
const ytdl = require('ytdl-core');
const helper = require('../../utils/helpers');

class Youtube {
  async videoInfo (payload) {
    try {
      const { url } = payload;
      const info = await ytdl.getBasicInfo(url);
      return wrapper.data({
        title: info.videoDetails.title,
        author: info.videoDetails.author.name
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
    res.setHeader('Content-disposition', 'attachment; filename=' + title + ' by YUJA.mp3');
    res.setHeader('Content-type', 'audio/mpeg');
    return await helper.convertToMp3(stream, title, res);
  }
}

module.exports = Youtube;
