import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import Token from '../utils/token';
import UsersCollection from '../utils/user';

const { ObjectId } = require('mongodb');

const FilesController = {
  postUpload: async (req, res) => {
    const xToken = req.headers['x-token'];
    const userId = await Token.retrieveUser(xToken);
    const id = ObjectId(userId);
    const user = await UsersCollection.getUser({ _id: id });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    const { type } = req.body;
    let { parentId } = req.body || 0;
    const isPublic = req.body.isPublic || false;
    const { data } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || (type !== 'file' && type !== 'folder' && type !== 'image')) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    const files = DBClient.getCollection('files');
    parentId = parentId === '0' ? 0 : parentId;
    if (parentId !== 0) {
      const idObject = ObjectId(parentId);
      const file = await files.findOne({ _id: idObject });
      if (!file) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not folder' });
      }
    }
    if (type === 'folder') {
      files.insertOne({
        userId: user._id,
        name,
        parentId,
        isPublic,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic,
          parentId,
        });
      }).catch((error) => {
        console.log(error);
      });
    } else {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${folderPath}/${uuidv4()}`;
      const fileData = Buffer.from(data, 'base64');
      try {
        try {
          await fs.mkdir(folderPath, { recursive: true });
        } catch (e) {
          console.log(e);
        }
        await fs.writeFile(fileName, fileData);
      } catch (e) {
        console.log(e);
      }
      files.insertOne({
        userId: user._id,
        name,
        type,
        isPublic,
        parentId,
        localPath: fileName,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId: user._id,
          name,
          type,
          isPublic,
          parentId,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
    return null;
  },
};
module.exports = FilesController;
