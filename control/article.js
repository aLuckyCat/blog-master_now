const {db} = require('../Schema/config');
const ArticleSchema = require('../Schema/article');
const encrypt = require('../util/encrypt');
//获取用户的Schema 来操作用户数据库
const UserSchema = require('../Schema/user');
const User = db.model('users',UserSchema)

//通过db对象创建操作article数据库的模型的对象

const Article = db.model('articles',ArticleSchema)

const CommentSchema = require('../Schema/comment');
const Comment = db.model('comments',CommentSchema)


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
    data.author = ctx.session.uid;
    //添加文章的作者
     new Promise((resolve,reject)=>{
         new Article(data).save((err,data)=>{
             if(err) return reject(err)
             resolve(data)
         })
     }).then(async data =>{
        ctx.body = {
             msg:'发表成功',
             status: 1
         }
         // ctx.body = {
         //     msg:'发表成功',
         //     status: 1
         // }
         // console.log(ctx.body)
     }).catch(err=>{
         console.log('我失败了')
         ctx.body = {
             msg:'失败',
             status: 0
         }
     })

}

//获取文章列表

exports.getList = async ctx=>{
    //查 每篇文章的 头像
    //动态路由获取  ctx.params.id
    let page = ctx.params.id|| 1;
    page--;

    const maxNum = await Article.estimatedDocumentCount((err,data)=> !err ? data:console.log(err));
    console.log(maxNum)
    const num = (maxNum-(5*page)>=5) ? 5:(maxNum-(5*page));
    const artList = await Article
        .find()
        .sort('-created')//- 号排序为降序
        .skip(5 * page)//跳过 几条
        .limit(5)//筛选 几条
        .populate({
            path:'author',
            select:'username _id avatar'//返回那些属性 空格隔开
        })//mongose 用来连表查询
        .then( data=> data)
        .catch(err=>err)
     await ctx.render('index', {
         session:ctx.session,
         title:'博客首页',
         artList,
         maxNum,
         num
         })
}

//文章详情页面

exports.details = async ctx =>{
    const _id = ctx.params.id;
    //查找文章本身数据
    const article =  await Article.findById(_id)
        .populate('author','username')
        .then(data=>data)
    //查找跟当前文章相关联的所有评论
    const comment = await Comment
        .find({article:_id})
        .sort('-created')
        .populate('form','username avatar')
        .then(data=>data)
        .catch(err=>{
            console.log(err)
        })
    console.log(comment)
    await ctx.render('article',{
        title:article.title,
        session:ctx.session,
        article,
        comment
    })
}