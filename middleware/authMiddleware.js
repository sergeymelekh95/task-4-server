const redisClient = require('../index');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const blackList = await redisClient.sMembers(
            'black_list',
            (err, reply) => {
                if (err) {
                    console.log('black_list error - ', err);
                }
            }
        );

        if (blackList.length && blackList.includes(req.body.email)) {
            console.log('5')
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
