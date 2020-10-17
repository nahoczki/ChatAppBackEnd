const io = require('socket.io');

module.exports.socketHandler = function(server) {

    const ioSocket = io.listen(server);

    ioSocket.on('connection', (socket) =>{

        socket.on('joinRoom', (data) => {

            let parsedData = JSON.parse(data);

            socket.join(parsedData['roomId']);
            console.log(`${parsedData['userId']} joined room ${parsedData['roomId']}`);
        });

        socket.on('sendMessage', (data) => {
            let parsedData = JSON.parse(data);


            socket.to(parsedData['roomId']).emit("newMessage", {
                "message" : parsedData['message']
            });
        });

        console.log('a user is connected');
    })
}