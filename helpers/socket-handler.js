const io = require('socket.io');
const ChatRoom =  require('../model/ChatRoom');

module.exports.socketHandler = function(server) {

    const ioSocket = io.listen(server);

    ioSocket.on('connection', (socket) =>{

        socket.on('joinRoom', (data) => {

            let parsedData = JSON.parse(data);

            socket.join(parsedData['roomId']);
            console.log(`${parsedData['userId']} joined room ${parsedData['roomId']}`);
        });

        socket.on('sendMessage', async (data) => {
            let parsedData = JSON.parse(data);


            const chatRoom = ChatRoom.findOne({_id: parsedData['roomId']});
            const messageObj = {
                userId: parsedData["userId"],
                content: parsedData["message"]
            }

            await chatRoom.updateOne({ $addToSet: { messages: [messageObj] },});

            socket.to(parsedData['roomId']).emit("newMessage", {
                "message" : parsedData['message']
            });
        });

        console.log('a user is connected');
    });
}