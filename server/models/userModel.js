const mongoose = require('mongoose')
// 用户表,会自动创建
const userSchema = new mongoose.Schema({
    uname: {
        type: String,
        // 必须字段
        require: true,
        // 长度在3~20之间
        min: 3,
        max: 20,
        // 唯一
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        max: 50
    },
    upass: {
        type: String,
        require: true,
        max: 8
    },
    // 是否设置了头像
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: ''
    }
})
module.exports = mongoose.model("Users", userSchema)