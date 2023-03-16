const mongoose = require('mongoose')
// 消息表 
const messageSchema = new mongoose.Schema(
    {
        message: {
            text: {
                type: String,
                required: true
            },
        },
        // 和消息有关的user,包括发送者
        users: Array,
        // 发送者
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            // 外键连接User表(库)
            ref: "User",
            require: true
        },
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model("Messages", messageSchema)