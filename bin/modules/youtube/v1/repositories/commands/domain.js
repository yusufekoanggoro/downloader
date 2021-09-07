const wrapper = require('../../../../../helpers/utils/wrapper');
const ytdl = require('ytdl-core');
const helper = require('../../utils/helpers');

class Youtube {
  async videoInfo (payload) {
    const URL = payload.url;
    try {
      const info = await ytdl.getBasicInfo(URL);
      return wrapper.data({
        title: info.videoDetails.title,
        author: info.videoDetails.author.name
      }, 'Success', 200);
    } catch (error) {
      return wrapper.error({}, 'Failed', 404);
    }
  }

  async download (payload, res) {
    const { url, title } = payload;
    const stream = await helper.getStream(url, res);
    res.setHeader('Content-disposition', 'attachment; filename=' + title + ' by YUJA.mp3');
    res.setHeader('Content-type', 'audio/mpeg');
    return await helper.convertToMp3(stream, title, res);
  }
}

module.exports = Youtube;
