class NotAuthenticated extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthenticated';
    this.status = 401;
  }
}

module.exports = NotAuthenticated;
