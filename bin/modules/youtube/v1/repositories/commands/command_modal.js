const joi = require('joi');

const checkURL = joi.object({
  url: joi.string().required()
});

const download = joi.object({
  title: joi.string().required(),
  url: joi.string().uri().required()
});

module.exports = {
  checkURL,
  download
};
