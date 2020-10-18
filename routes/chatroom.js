const router = require('express').Router();
const ChatRoom =  require('../model/ChatRoom');
const User =  require('../model/User');
const verify = require('../helpers/verifyToken');
const jwt = require('jsonwebtoken');

const {handleErrorMsg} = require("../helpers/error-handler");
const {roomValidation} = require('../helpers/validation');

router.get('/', verify, async (req, res) => {

    try {
        const requestingUserId = jwt.decode(req.header("auth-token"))._id;

        const requestingUser = await User.findOne({ _id: requestingUserId });
        const chatRooms = requestingUser.chatrooms;

        let chatRoomArr = [];

        for (let chatRoomId of chatRooms) {
            const chatRoom = await ChatRoom.findOne({_id: chatRoomId});

            chatRoomArr.push(chatRoom);
        }


        res.status(200).json({
            chatrooms: chatRoomArr
        });
    } catch (e) {
        res.status(400).send(handleErrorMsg(400, "Internal Error"));
    }
})

router.post('/', verify, async (req, res) => {

    //Validation
    const { error } = roomValidation(req.body);
    if (error) return res.status(400).send(handleErrorMsg(400, error.details[0].message));

    const requestingUserId = jwt.decode(req.header("auth-token"))._id;
    const requestingUser = await User.findOne({ _id: requestingUserId });

    if (requestingUserId === req.body.recipient) return res.status(400).send(handleErrorMsg(400, "Cannot make a chatroom with yourself"))

    // Get and check if recipient exists in db
    const recipient = await User.findOne({ _id: req.body.recipient });
    if (!recipient) return res.status(400).send(handleErrorMsg(400, "User does not exist"));

    try {

        const cleanedRequesting = {
            _id : requestingUser._id,
            firstname : requestingUser.firstname,
            lastname : requestingUser.lastname
        };

        const cleanedRecipient = {
            _id : recipient._id,
            firstname: recipient.firstname,
            lastname: recipient.lastname
        };

        const newChatRoom = new ChatRoom({
            users : [cleanedRequesting, cleanedRecipient]
        });

        //Save
        const savedChatRoom = await newChatRoom.save();
        await requestingUser.updateOne({ $addToSet: { chatrooms: [savedChatRoom._id] },});
        await recipient.updateOne({ $addToSet: { chatrooms: [savedChatRoom._id] },});

        res.status(200).send(savedChatRoom);

    } catch (e) {
        res.status(400).send(handleErrorMsg(400, "Internal Error"))
    }
})

module.exports = router;