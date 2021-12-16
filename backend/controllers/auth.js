const auth = require('../model/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req,res) => {
    bcrypt.hash(req.body.password, 10 ).then(hash => {
        const user = new auth({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message : 'New user has been created',
                result: result
            });
        })
            .catch(err => {
                res.status(500).json({
                    message : 'User already exits, please login or use different email id.'
                })
            })
    })
}

exports.loginUser = (req,res) => {
    let fetchUser;
    auth.findOne({email: req.body.email}).then(user => {
        fetchUser = user;
        if (!user) {
            handle401(res)
        }
        return bcrypt.compare(req.body.password, user.password);
    })
        .then(result => {
            if (!result) {
                handle401(res);
            }
            const token = jwt.sign(
                {email: fetchUser.email, userId: fetchUser._id},
                process.env.JWT_KEY,
                {expiresIn: '1h'}
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600, //Sent time in seconds
                userId: fetchUser._id
            });
        })
        .catch(err => {
            handle401(res)
        });
}

function handle401(res) {
    return res.status(401).json({
        message: 'Invalid email id or password.'
    })
}
