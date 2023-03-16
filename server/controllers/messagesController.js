const messageModel = require('../models/messagesModel')
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body
        console.log(from, to);
        const data = await messageModel.create({
            message: {
                text: message,
            },
            users: [from, to],
            sender: from
        })
        console.log(data);
        if (data) return res.json({ msg: '消息发送成功' })
        return res.json({ msg: "发送消息失败" })
    } catch (ex) {
        next(ex)
    }
}
module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body
        // console.log(from, to);
        const messages = await messageModel.find({
            users: {
                // 匹配数组中多个值
                $all: [from, to]
            }
        })
            // 根据更新时间排序
            .sort({ updatedAt: 1 })
        const projectMessages = messages.map((msg) => {
            return {
                // 是不是从当前登录用户发送的 -> 前端依次判断要不要显示
                fromSelf: msg.sender.toString() === from,
                // 消息内容
                message: msg.message.text
            }
        })
        res.json(projectMessages)
    } catch (ex) {
        next(ex)
    }
}