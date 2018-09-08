const {db} = require('../Schema/config');
const ArticleSchema = require('../Schema/article');
const Article = db.model('articles',ArticleSchema)
const encrypt = require('../util/encrypt');
//获取用户的Schema 来操作用户数据库
const UserSchema = require('../Schema/user');
const User = db.model('users',UserSchema)

//通过db对象创建操作article数据库的模型的对象
const CommentSchema = require('../Schema/comment');
const Comment = db.model('comments',CommentSchema);




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
            User.update({_id:data.from},{$inc:{commentNum:1}},err=>{if(err)console.log(err)})
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
    const commentId = ctx.params.id;
    let isOk = true;
    //让文章的计数器减一
    // await Article.update({_id:articleId},{$inc:{commentNum:-1}})
    // await User.update({_id:uid},{$inc:{commentNum:-1}})
    let articleId,uid;

    await  Comment.findById(commentId,(err,data )=>{
        if(err){
            console.log(err)
            isOk = false;
        }else{
         articleId = data.article;
         uid = data.form;
        }
    })
    await Article.update({_id:articleId},{$inc:{commentNum:-1}})
    await User.update({_id:uid},{$inc:{commentNum:-1}})
    await Comment.deleteOne({_id:commentId})
    if(isOk){
        ctx.body = {
            state:1,
            message:'删除成功!'
        }
    }
}

