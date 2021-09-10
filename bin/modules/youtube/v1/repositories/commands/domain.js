const wrapper = require('../../../../../helpers/utils/wrapper');
const helper = require('../../utils/helpers');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');
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
    const { filename } = payload;

    const reqPath = path.join(__dirname, `../../../../../../tmp/${filename}`);
    if (fs.existsSync(reqPath)) {
      const filestream = fs.createReadStream(reqPath);
      res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3');
      res.setHeader('Content-Type', 'audio/mpeg');
      filestream.on('data', () => {
        // console.log('on data')
      });
      filestream.on('end', () => {
        // console.log("SELESAI")
      });
      return filestream.pipe(res);
    }
    return wrapper.response(res, 'success', '', 'Not Found', 404);
  }

  async checkDownload (payload) {
    const { title } = payload;
    helper.checkDownload(payload);
    return wrapper.data({ fileName: `${title} BY YUJA.mp3` }, 'Checking Download', 200);
  }

  async deleteFile (payload) {
    // const { fileName } = payload;
  }
}

module.exports = Youtube;
