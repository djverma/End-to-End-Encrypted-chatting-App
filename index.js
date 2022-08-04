// Node server to handle socket connections
const crypto=require('crypto');
const { off } = require('process');
const io=require('socket.io')(8000)
const users={};
const keys=[];
io.on('connection',socket=>{
    socket.on('new-user-joined',info=>{
        console.log(1);
        users[socket.id]=info.name;
        keys.push(info.pb_key);
        socket.broadcast.emit('user-joined',info.name);    //socket.broadcast.emit --> broadcasts to everyone(except the newuser) that a new user joined named as name
        socket.broadcast.emit('keysE',keys);
    })
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message ,name:users[socket.id]});
    })
   socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
   })
})