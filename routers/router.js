
const Router = require('koa-router')
const router = new Router();
const user = require('../control/user')
//设计主页
router.get('/',user.KeepLog,async ctx=>{
    //需要title属性
    await ctx.render('index',{
        title:"假装这是一个正经的title",
        session:ctx.session
    })
})
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



module.exports = router;