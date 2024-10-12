import sha1 from 'sha1';

class Password {
  static hashPassword(password) {
    return sha1(password);
  }

  static checkPassword(inputPassword, storedPassword) {
    if (sha1(inputPassword) === storedPassword) {
      return true;
    }
    return false;
  }
}

module.exports = Password;
