const socketIO = require('socket.io');

let io;

module.exports = {
    init: (httpServer) => {
        io = socketIO(httpServer, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        io.on('connection', (socket) => {
            console.log('Un cliente se ha conectado');
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.IO no está inicializado.');
        }
        return io;
    }
};
