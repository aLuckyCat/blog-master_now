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
    data.commentNum = 0;
    //添加文章的作者
     await new Promise((resolve,reject)=>{
         new Article(data).save((err,data)=>{
             if(err) return reject(err)
             //保存成功时更新文章计数器
             User.update({_id:data.author},{$inc:{
                 articleNum:1
                 }},err=>{
                 if(err)console.log(err);
             })
             resolve(data)
         })
     }).then(async data =>{
        ctx.body = {
             msg:'发表成功',
             status: 1
         }
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
    await ctx.render('article',{
        title:article.title,
        session:ctx.session,
        article,
        comment
    })
}

//获取用户所有文章

exports.artlist = async ctx =>{
    console.log(11111111111111111111111122222222)
    const id = ctx.session.uid;
    const data = await Article.find({author:id});
    ctx.body = {
        code:0,
        count:data.length,
        data
    }
}

//删除文章
exports.del = async ctx=>{
    const _id = ctx.params.id;
    let uid = ctx.session.uid;
    let res = {

    }
    await Article.deleteOne({_id}).exec(async (err)=>{
        if(err){
            res = {
                state:0,
                message:'删除失败'
            }
        }else{
          await  Article.findById(_id,(err,data)=>{
                if(err)return console.log(err)

                uid = data.author;
            })
        }
    })
    await User.update({_id:uid},{$inc:{articleNum:-1}})
    //删除所有评论
    await Comment.find({article:_id}).then(async data=>{
        //data 是一个数组
        let len = data.length;
        let i = 0;
        async function deleteUser(){
            if(i>=len)return
            const cId = data[i]._id;
            await  Comment.deleteOne({_id:cId}).then(data =>{
                User.update({_id:data[i].form},{$inc:{commentNum:-1}},err =>{
                    if(err)return console.log(err)
                    i++;
                })
            })
        }
        await deleteUser();
        res = {
            state:1,
            message:'成功'
        }
    })
}