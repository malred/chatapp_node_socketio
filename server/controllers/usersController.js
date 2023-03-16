const User = require('../models/userModel')
// 加密
const bcrypt = require('bcrypt');
module.exports.register = async (req, res, next) => {
    try {
        // console.log(req.body);
        const { uname, email, upass } = req.body;
        // 查看uname是否已经存在(已存在不能重复注册)
        const unameCheck = await User.findOne({ uname })
        if (unameCheck) return res.json({ msg: "该用户名已存在", status: false })
        const emailCheck = await User.findOne({ email })
        if (emailCheck) return res.json({ msg: '该邮箱已存在', status: false })
        // 密码加盐, 10 -> 盐值
        const hashedPass = await bcrypt.hash(upass, 10)
        // 保存到数据库
        const user = await User.create({
            email,
            uname,
            upass: hashedPass
        })
        // 返回的user不能带密码
        delete user.upass
        // 返回user对象 
        return res.json({ status: true, user })
    } catch (ex) {
        // 异常
        next(ex)
    }
}
module.exports.login = async (req, res, next) => {
    try {
        // console.log(req.body);
        const { uname, upass } = req.body;
        // 查看user是否存在 
        const user = await User.findOne({ uname })
        if (!user)
            return res.json({ msg: "该用户不存在", status: false })
        // 密码是否一致
        const isPassValid = await bcrypt.compare(upass, user.upass)
        if (!isPassValid)
            return res.json({ msg: '密码不正确', status: false })
        // 删除user对象里的upass字段,再传给前端
        delete user.upass
        // 返回user对象 
        return res.json({ status: true, user })
    } catch (ex) {
        // 异常
        next(ex)
    }
}
module.exports.setAvatar = async (req, res, next) => {
    try {
        // 从路由query中获取id参数
        const userId = req.params.id
        const avatarImage = req.body.img
        // 根据id找到user,并更新
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (ex) {
        next(ex)
    }
}

module.exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find({
            _id: {
                // ne表示选择除了该id的其他user
                $ne: req.params.id
            }
        }).select([
            // 要查询出来的字段
            'email', 'uname', 'avatarImage', '_id'
        ])
        return res.json(users)
    } catch (ex) {
        next(ex)
    }
}