
const encrypt = require('../util/encrypt');
const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')




//保存评论
exports.save = async ctx=>{
    let message ={
        status:0,
        msg:'登录才可以发表评论'
    }
    //验证用户是否登录
    if(ctx.session.isNew)return ctx.body = message;

    //用户登录后
    const data = ctx.request.body;
        data.form = ctx.session.uid;

    const _comment = new Comment(data);
    await _comment
        .save()
        .then(data =>{
            message = {
                status:1,
                msg:'评论成功'
            }

            //更新当前文章的计数器
            Article
                .update({_id:data.article},{$inc:{commentNum: 1}},err=>{
                    if(err){
                        console.log(err)
                    }
                })
            //更新用户评论计数器
            User.update({_id:data.form},{$inc:{commentNum:1}},err=>{if(err)console.log(err)})
        })
        .catch(err=>{
            message = {
                status:0,
                msg:err
            }
        })
    ctx.body =  message;
}
// 后台 查询用户所有评论

exports.comlist = async ctx =>{
    const uid = ctx.session.uid;
    const data =  await Comment.find({form: uid}).populate("article",'title')
    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

//删除评论
exports.del = async ctx =>{
    // 拿到 commentID

    const commentId = ctx.params.id;

    let res = {
        state:1,
        massage:'成功'
    }
    // Comment.findByIdAndRemove(commentId).exec()  findByIdAnd*   这些api都不会触发钩子
    // new Comment({})//删除行为必须使用这种构造
   await  Comment.findById(commentId).then(data=>{
        data.remove()
    }).catch(err=>{
        res = {
            state:0,
            massage:err
        }
    })
    ctx.body = res;
}
