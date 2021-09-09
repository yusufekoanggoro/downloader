const joi = require('joi');

const videoInfo = joi.object({
  url: joi.string().uri().required()
});

const download = joi.object({
  url: joi.string().uri().required()
});

const checkDownload = joi.object({
  url: joi.string().uri().required()
});


module.exports = {
  videoInfo,
  download,
  checkDownload
};
