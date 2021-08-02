const url = window.location.hostname.includes("localhost") // If hostname includes localhost we are at localhost, otherwise at heroku url
  ? "http://localhost:8080/api/auth/"
  : "https://restserver-nodejs-jm.herokuapp.com/api/auth/";

let usuario = null;
let socket = null;

// Referencias HTML

txtUid  = document.querySelector('#txtUid');
txtMensaje  = document.querySelector('#txtMensaje');
ulUsuarios = document.querySelector('#ulUsuarios');
ulMensajes  = document.querySelector('#ulMensajes');
btnLogout   = document.querySelector('#btnLogout');


const JWTValidate = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.loaction = 'index.html';
        throw new Error('No token detected');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });


    const {user: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.name;

    await socketConnection();

}

const socketConnection = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    })

    socket.on('receive-messages', drawMessages)
    socket.on('active-users', drawUsers)

    socket.on('private-message', (payload) => {
        console.log('privado:', payload)
    })
}

const drawUsers = (users=[]) => {
    let usersHTML = '';
    users.forEach( ({name, uid})=> {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `
    })

    ulUsuarios.innerHTML = usersHTML;
}


const drawMessages = (messages=[]) => {
    let messagesHTML = '';
    messages.forEach( ({name, message})=> {
        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ name }</span>
                    <span>${ message }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = messagesHTML;
}

txtMensaje.addEventListener('keyup', ( {keyCode }) => {
    
    const message = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) {
        return;
    }
    if( message.length === 0) {
        return;
    }
    
    socket.emit('send-message', { message, uid });
    
    txtMensaje.value = ""
})

const main = async() => {

    // Validar JWT
    await JWTValidate();

}



main();


