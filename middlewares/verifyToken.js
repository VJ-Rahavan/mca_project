import jwt from 'jsonwebtoken';
import { decryptDetails } from '../lib/functions.js';

export const verifyToken = async (req, res, next) => {
  const encryptedToken =
    req.headers.authorization?.split(' ')[1] ||
    req.headers.Authorization?.split(' ')[1];

  console.log('Encrypted Token:', req.headers);

  if (!encryptedToken) {
    return res
      .status(401)
      .send({ message: 'You are unauthorized.', success: false });
  } else {
    const token = decryptDetails(encryptedToken);
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
      if (err) {
        return res
          .status(401)
          .send({ message: 'You are unauthorized.', success: false });
      }
      req._id = data._id;
      next();
    });
  }
};
