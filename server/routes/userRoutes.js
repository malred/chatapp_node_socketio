const router = require('express').Router()
const { register, login, setAvatar, allUsers } = require('../controllers/usersController')
router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', setAvatar)
router.get('/allUsers/:id', allUsers)
module.exports = router