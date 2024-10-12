import UsersCollection from './user';
import Password from './hash_password';

class Auth {
  static decodeAuthorization(auth) {
    const autHeader = auth.split(' ')[1];
    const decodedString = Buffer.from(autHeader, 'base64').toString('utf8');
    return decodedString;
  }

  static async authUser(decodedHeader) {
    const email = decodedHeader.split(':')[0];
    const password = decodedHeader.split(':')[1];
    const user = await UsersCollection.getUser({ email });
    const storedPassword = user.password;
    if (Password.checkPassword(password, storedPassword)) {
      return true;
    }
    return false;
  }
}

module.exports = Auth;
