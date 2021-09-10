const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const deleteDirectoryInTmp = async (name) => {
  const dir = path.join(__dirname, `../../../tmp/${name}`);
  try {
    await fs.rmdirSync(dir, { recursive: true });
  } catch (error) {
    logger.log('delete-directory', `Error while deleting ${dir}.`, 'error');
  }
};

module.exports = {
  deleteDirectoryInTmp
};
