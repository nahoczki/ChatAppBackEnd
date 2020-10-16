const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    users: {
        type: Array,
        min: 2,
        required: true
    },
    messages: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);