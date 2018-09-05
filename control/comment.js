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
            console.log("评论成功")
            message = {
                status:1,
                msg:'评论成功'
            }

            //更新当前文章的计数器

        })
        .catch(err=>{
            message = {
                status:0,
                msg:err
            }
        })
    ctx.body =  message;
}
