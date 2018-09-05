
const Router = require('koa-router')
const router = new Router();
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment')
//设计主页
router.get('/',user.KeepLog,article.getList)
//(:id)动态路由 用来处理 用户登录注册以及退出
router.get(/^\/user\/[(?=reg)|(?=login)]/,async ctx=>{
    //show 为true是显示注册页面  否则显示登录页面
    const show  = /reg$/.test(ctx.path);
    await ctx.render('register',{show})
})
//处理用户注册的情求 post
router.post('/user/reg',user.reg)
//处理用户登录的情求  post
router.post('/user/login',user.login)
//退出情求
router.get('/user/userout',user.logout);

//返回文章页面
router.get('/article',user.KeepLog,article.addPage);

//发表文章
router.post('/article',user.KeepLog,article.add);

//文章列表的分页路由
router.get('/page/:id',article.getList);

//文章的详情页面  路由
router.get('/article/:id',user.KeepLog,article.details);

//发表评论
router.post('/comment',user.KeepLog,comment.save)
module.exports = router;