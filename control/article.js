const {db} = require('../Schema/config');
const ArticleSchema = require('../Schema/article');
const encrypt = require('../util/encrypt')

//通过db对象创建操作article数据库的模型的对象

const Article = db.model('articles',ArticleSchema)


//返回文章发表页
exports.addPage = async ctx=>{
    await ctx.render('add-article',{
        title:'文章发表页',
        session:ctx.session
    })
} 

// 文章的发表 并保存到数据库

exports.add = async ctx=>{
    console.log("我在add路由里")
    if(ctx.session.isNew){
        //true 就是没登录
        return ctx.body = {
            msg:'用户未登陆',
            status:0
        }
    }
    //用户在登陆状态 下  post发送回来的数据
    const data = ctx.request.body;
    //添加文章的作者
        data.author = ctx.session.username;
     new Promise((resolve,reject)=>{
         new Article(data).save((err,data)=>{
             if(err) return reject(err)
             resolve(data)
         })
     }).then(async data =>{
         console.log("发表成功")
        ctx.response.body = {
             msg:'发表成功',
             status: 1
         }
         console.log(ctx)
         console.log(">>>>>>>>>>>>>>>>>>>>>>>>")
         console.log(ctx.response);
         // ctx.body = {
         //     msg:'发表成功',
         //     status: 1
         // }
         // console.log(ctx.body)
     }).catch(err=>{
         console.log('我失败了')
         ctx.response.body = {
             msg:'失败',
             status: 0
         }
     })

}