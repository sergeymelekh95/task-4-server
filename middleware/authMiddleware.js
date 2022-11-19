const blackList = require('../index');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        if (blackList.size && blackList.has(req.body.email)) {
            return res.status(403).json({ message: 'user are blocked' });
        }

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res
                    .status(403)
                    .json({ message: 'user are not authorized' });
            }

            const decodedData = jwt.verify(token, secret);

            req.user = decodedData;
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: 'user are not authorized' });
    }
};
