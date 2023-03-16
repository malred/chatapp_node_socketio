const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messagesRoutes")
const app = express()
const socket = require('socket.io')
// 加载.env配置文件
require("dotenv").config()
// 跨域
app.use(cors())
// 可以接收json数据
app.use(express.json())
// 注册路由
app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('成功连接mongodb');
}).catch((err) => {
    console.log(err.message);
})
const server = app.listen(process.env.PORT, () => {
    console.log(`服务器启动,在${process.env.PORT}端口监听`);
})
const io = socket(server, {
    cors: {
        // 支持跨域的源
        origin: "http://localhost:3000",
        credentials: true
    }
})
// 全局对象保存当前所有在线用户
global.onlineUsers = new Map()
// socketio监听并处理事件
io.on('connection', (socket) => {
    // socket是当前连接的客户端的socket
    // 保存到global
    global.chatSocket = socket
    // 监听添加user事件
    // 断开连接自动销毁
    socket.on('add-user', (userId) => {
        // 将新增user添加到global的map对象里
        onlineUsers.set(userId, socket.id)
    })
    // 发送消息
    // data {to,from,msg}
    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        // 如果该用户在线
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data.msg)
        }
    })
})