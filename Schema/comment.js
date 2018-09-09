const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const CommentSchema =  new Schema({
    //头像 用户
    //文章
    //内容
    content:String,
    //关联用户表
    form:{
        type:ObjectId,
        ref:'users'
    },
    //关联文章表
    article:{
        type:ObjectId,
        ref:'articles'
    }
},{versionKey: false,timestamps:{
        createdAt:"created"
    }})

//设置 comment 的remove的钩子函数
CommentSchema.post("remove", (doc) => {
    // 当前这个回调函数  一定会在 remove 事件执行触发
    const Article = require('../Models/article')
    const User = require('../Models/user')

    const { form, article } = doc

    // 对应文章的评论数 -1
    Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()
    // 当前被删除评论的作者的 commentNum -1
    User.updateOne({_id: form}, {$inc: {commentNum: -1}}).exec()
})

module.exports = CommentSchema;