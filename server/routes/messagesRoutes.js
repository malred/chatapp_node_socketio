const router = require('express').Router()
const { getAllMessage, addMessage } = require('../controllers/messagesController')
// 添加消息
router.post('/addmsg', addMessage)
// 获取所有消息
router.post('/getmsg', getAllMessage)
module.exports = router