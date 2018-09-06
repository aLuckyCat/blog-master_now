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

const fs = require('fs');
const {join} = require('path')


exports.index = async ctx=>{
    if(ctx.session.isNew){
        //没有登录
        ctx.status = 404;
        return await ctx.render('404',{title:'404'})
    }
    const id = ctx.params.id;

    const arr = fs.readdirSync(join(__dirname,"../views/admin"))
    let flag = false;

    arr.forEach((v)=>{
        const name = v.replace(/^(admin\-)|(\.pug)$/g,"");
        if(name === id){
        flag = true;
        }
    })
    if(flag){
    await ctx.render(`./admin/admin-${id}`,{
        title:'个人中心',
        role:ctx.session.role
    })
    }else{
        ctx.status = 404;
        await ctx.render('404',{title:'404'})
    }
}