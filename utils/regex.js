const regexUrl = /^(http:\/\/|https:\/\/)[a-z0-9_-]+\.[a-z0-9_-]+(\.[a-z0-9_-]+)*(:[0-9]+)?(\/.*)?$/;
const regexId = /^[0-9a-fA-F]{24}$/;

module.exports = {
  regexUrl,
  regexId,
};
