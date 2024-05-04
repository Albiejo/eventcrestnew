const { Server } = require('socket.io');



 const initializeSocket = (httpServer)=>{
    
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5000" ,"http://localhost:3001" ]
        }
    });


    
let users = [];


const addUser = (userId, socketId)=>{
    !users.some((user)=> user.userId === userId) && 
    users.push({userId, socketId , lastSeen: Date.now() })
}


const removeUser = (socketId)=>{
    users = users.filter((user)=>{
        return user.socketId!== socketId;
    })
}


const getUser = (userId)=>{
    return users.find((user)=>user.userId === userId)
}


const updateUserLastSeen = (socketId) => {
    const user = users.find(user => user.socketId === socketId);
    if (user) {
        user.lastSeen = Date.now();
    }
};


const isUserActive = (lastSeen) => {
    const heartbeatInterval = 60000; 
    return Date.now() - lastSeen <= heartbeatInterval;
};









io.on("connection", (socket) => {
   
console.log("socket server running");

    
    socket.on("adduser" , (userId)=>{
        addUser(userId, socket.id);
        io.emit("getUsers" , users)
    });



    socket.on("sendMessage", ({ senderId, receiverId, text, imageName ,imageUrl}) => {
        
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
                imageName,
                imageUrl
            });
      
        } else {
            console.error('User not found:', receiverId);
        }
    });



    socket.on("typing", ({ receiverId }) => {
       
        const user = getUser(receiverId); 
        if (user) {
            io.to(user.socketId).emit("typingsent", {
                senderId: socket.id,
            });
      
        } else {
            console.error('User not found:', receiverId);
            console.log(users)
        }
    });



    socket.on("stopTyping", ({ receiverId }) => {
       
    const user = getUser(receiverId); 
    if (user) {
        io.to(user.socketId).emit("stopTypingsent", {
            senderId: socket.id, 
        });
    } else {
        console.error('User not found:', receiverId);
    }
});


    socket.on("checkUserActiveStatus", (receiverId) => {
        const user = users.find(u => u.userId === receiverId );
        if (user) {
            const active = isUserActive(user.lastSeen);
            const lastSeen = new Date(user.lastSeen).toLocaleString();
            socket.emit("userActiveStatus", { receiverId, active , lastSeen});
        }else{
            const message = "Not Active";
            socket.emit("userNotACtive", { message });
        }
    });
    
    socket.on("disconnect" , ()=>{
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    
    socket.on("heartbeat", () => {
        updateUserLastSeen(socket.id);
    });
   
});

};

module.exports = {
    initializeSocket
};
