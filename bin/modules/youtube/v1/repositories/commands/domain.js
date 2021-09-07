const wrapper = require('../../../../../helpers/utils/wrapper');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const helper = require('../../utils/helpers');
const path = require('path');
const util = require('util');
const logger = require('../../../../../helpers/utils/logger');

class Youtube {
  async videoInfo (payload) {
    const URL = payload.url;
    try {
      let info = await ytdl.getBasicInfo(URL);
      return wrapper.data({
        title: info.videoDetails.title,
        author: info.videoDetails.author.name
      }, 'Success', 200);
    } catch (error) {
      return wrapper.error({}, 'Failed', 404);
    }
  }

  async download (payload, res) {
    const {url, title} = payload;
    const stream = await helper.getStream(url, res);
    res.setHeader('Content-disposition', 'attachment; filename=' + title + ' by YUJA.mp3');
    res.setHeader('Content-type', 'audio/mpeg');
    return await helper.convertToMp3(stream, title, res);
  }
}

module.exports = Youtube;
