import Auth from '../utils/auth';
import Token from '../utils/token';
import UsersCollection from '../utils/user';
import Password from '../utils/hash_password';

const AuthController = {
  getConnect: async (req, res) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const authStr = Auth.decodeAuthorization(authheader);
    const email = authStr.split(':')[0];
    const password = authStr.split(':')[1];
    const user = await UsersCollection.getUser({ email });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!Password.checkPassword(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (Auth.authUser(authStr)) {
      const token = Token.createToken();
      await Token.saveToken(user, token, 86400);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  },
  getDisconnect: async (req, res) => {
    const xToken = req.headers['x-token'];
    const userId = await Token.retrieveUser(xToken);
    if (userId) {
      await Token.delToken(xToken);
      return res.status(204).send();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  },
};
module.exports = AuthController;
