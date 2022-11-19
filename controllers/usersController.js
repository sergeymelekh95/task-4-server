const redisClient = require('../index');
const User = require('../models/User');

class usersController {
    async getUsers(req, res) {
        try {
            const users = await User.find();

            res.json(users);
        } catch (err) {
            return res
                .status(404)
                .json({ message: `unable to get users, error - ${err}` });
        }
    }

    async deleteUsers(req, res) {
        try {
            const { emails } = req.body;

            await redisClient.sRem('black_list', emails, (err, reply) => {
                if (err) {
                    return res.status(404).json({
                        message: `unable to get users from black_list, error - ${err}`,
                    });
                }
            });

            const deleted = await User.deleteMany({
                email: {
                    $in: emails,
                },
            });

            if (deleted.acknowledged) {
                return res.json({
                    message: `Deleted ${deleted.deletedCount} users`,
                });
            }
        } catch (err) {
            return res.status(403).json({
                message: `unable to delete users from db, error - ${err}`,
            });
        }
    }

    async changeStatus(req, res) {
        try {
            const { emails, status } = req.body;

            if (status) {
                await redisClient.sAdd('black_list', emails, (err, reply) => {
                    if (err) {
                        return res.status(404).json({
                            message: `black_list error - ${err}`,
                        });
                    }
                });
            } else {
                await redisClient.sRem('black_list', emails, (err, reply) => {
                    if (err) {
                        return res.status(404).json({
                            message: `black_list error - ${err}`,
                        });
                    }
                });
            }

            const updated = await User.updateMany(
                { email: { $in: emails } },
                { $set: { isBlock: status } }
            );

            if (updated) {
                return res.json({
                    message: `Updated status`,
                });
            }
        } catch (err) {
            return res.status(404).json({
                message: `didn't update status, err - ${err}`,
            });
        }
    }
}

module.exports = new usersController();
