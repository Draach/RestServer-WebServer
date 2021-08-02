
const { Socket } = require('socket.io');
const { checkJWT } = require("../helpers/generateJWT");
const { ChatMessages } = require('../models')

const chatMessages = new ChatMessages();

const socketController = async( socket, io ) => {
    
    const user = await checkJWT(socket.handshake.headers['x-token'])
    if (!user) {
        return socket.disconnect();
    }
    
    // Agregar el usuario conectado.
    chatMessages.connectUser( user );
    io.emit('active-users', chatMessages.usersArray);
    socket.emit('receive-messages', chatMessages.last10);

    // Conectarlo a una sala especial.
    socket.join( user.id ); // global, socket.id, user.id



    // Limpiar cuando alguien se desconecta.
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArray);
    })

    socket.on('send-message', ( {message, uid}) => {        

        if ( uid ) {
            // Mensaje Privado
            socket.to( uid ).emit('private-message', {de: user.name, message });
        }else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chatMessages.last10);
        }

    })

}




module.exports = {
    socketController
}