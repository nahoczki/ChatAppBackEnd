const io = require('socket.io');

module.exports.socketHandler = function(server) {

    const ioSocket = io.listen(server);

    ioSocket.on('connection', (socket) =>{

        socket.on('joinRoom', (data) => {
            socket.join('112233');
            console.log("Joined room");
        });

        socket.on('newMessage', (data) => {
            console.log(data);
            socket.to('112233').emit("1234", {
                "message" : "fuck"
            });
        });

        console.log('a user is connected');
    })



}