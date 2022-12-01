const crypto=require('crypto');
const aes256=require('aes256');
const socket= io('http://localhost:8000');
const form= document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector('.container');
var audio= new Audio('sound.mp3');
const KEYS=[];
var secret;
const append= (message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }
    messageElement.scrollIntoView();
}

const name=prompt("Enter your name");
console.log(1);

const user1=crypto.getDiffieHellman('modp15');
user1.generateKeys();
console.log(user1.getPublicKey().toString('hex'));
const private_key=user1.getPrivateKey();
const public_key=user1.getPublicKey();
const userInfo={name:name,pb_key:public_key};
console.log(user1.getPrime().toString('hex'));
socket.emit('new-user-joined',userInfo); 
socket.on('keysE',keys=>{
    if(keys.length==2){
        if(keys[0]!=user1){
           secret=String(user1.computeSecret(keys[0]));
        }
        else{
           secret=String(user1.computeSecret(keys[1]));
        }
    }
})

socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right');
})
socket.on('receive',data=>{
    const decrypted= aes256.decrypt(secret,data.message);
    append(`${data.name}:${data.message}`,'left');
})
socket.on('left',data=>{
    append(`${data} left the chat`);
})
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right');
    const encrpyted=aes256.encrypt(secret,message);
    socket.emit('send',encrpyted);
    messageInput.value='';
})

