const io = require('socket.io');

module.exports.socketHandler = function(server) {

    const ioSocket = io.listen(server);

    ioSocket.on('connection', (socket) =>{

        socket.on('newMessage', (data) => {
            console.log(data);
            socket.emit("1234", {
                "message" : "fuck"
            });
        });

        console.log('a user is connected');
    })



}