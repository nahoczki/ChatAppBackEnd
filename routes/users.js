const router = require('express').Router();
const User =  require('../model/User');
const verify = require('../helpers/verifyToken')

router.get('/', verify, async (req, res) => {

    let usersArr = []

    await User.find({}).then(
        users => {
            let user;
            for (user of users) {
                let cleanedUser = {
                    _id : user._id,
                    firstname : user.firstname,
                    lastname : user.lastname
                };
                usersArr.push(cleanedUser);
            }
        }
    )

    res.json({
        users: usersArr
    })

})

module.exports = router;