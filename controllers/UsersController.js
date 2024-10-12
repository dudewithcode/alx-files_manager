import UsersCollection from '../utils/user';
import Token from '../utils/token';

const { ObjectId } = require('mongodb');

const UsersController = {
  postNew: async (req, res) => {
    const email = req.body.email || '';
    const password = req.body.password || '';

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).json({ error: 'Missing password' });
    } else if (await UsersCollection.getUser({ email })) {
      res.status(400).json({ error: 'Already exist' });
    } else {
      const insId = await UsersCollection.createUser(email, password);
      res.status(200).json({ id: insId, email });
    }
  },
  getMe: async (req, res) => {
    const xToken = req.headers['x-token'];
    const userId = await Token.retrieveUser(xToken);
    const id = ObjectId(userId);
    const user = await UsersCollection.getUser({ _id: id });
    if (user) {
      return res.json({ id: user._id, email: user.email });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  },
};
module.exports = UsersController;
