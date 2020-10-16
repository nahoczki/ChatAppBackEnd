const router = require('express').Router();
const User =  require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {handleErrorMsg} = require("../helpers/error-handler");
const {loginValidation, registerValidation} = require('../helpers/validation');


router.post('/register', async (req, res) => {
    //Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(handleErrorMsg(400, error.details[0].message));

    //Check if user exists
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(409).send(handleErrorMsg(409, "Email already exists"));

    //Hash pass
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt)

    //Create User
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savedUser = await user.save();
        res.send({
            _id : savedUser._id,
            firstname : savedUser.firstname,
            lastname : savedUser.lastname,
            email : savedUser.email,
            chatrooms : savedUser.chatrooms
        });
    }catch (e) {
        res.status(400).send(handleErrorMsg(400, "Internal Error"))
    }

})

router.post('/login', async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(handleErrorMsg(400, error.details[0].message));

    //Check if user exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).send(handleErrorMsg(401, "User does not exist, or password is incorrect"));

    //Check if pass is correct
    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if (!validPass) return res.status(401).send(handleErrorMsg(401, "User does not exist, or password is incorrect"));

    //Create and assign jwt token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);

    res.send({
        _id : user._id,
        firstname : user.firstname,
        lastname : user.lastname,
        email : user.email,
        chatrooms : user.chatrooms
    });

})


module.exports = router;