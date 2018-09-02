
const Router = require('koa-router')
const router = new Router();
const fs = require('fs')

//设计主页
router.get('/',async ctx=>{
    //需要title属性
    await ctx.render('index',{
        title:"假装这是一个正经的title"
    })
})
//动态路由 用来处理 用户登录注册以及退出
router.get(/^\/user\/[(?=reg)|(?=login)]/,async ctx=>{
    //show 为true是显示注册页面  否则显示登录页面
    const show  = /reg$/.test(ctx.path);
    await ctx.render('register',{show})
})
module.exports = router;