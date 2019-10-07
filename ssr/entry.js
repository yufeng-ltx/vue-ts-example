import createApp from '../src/createApp';

export default context => new Promise((resolve, reject) => {
  const { app, router, store } = createApp();
  // 设置服务器端 router 的位置
  router.push(context.url);
  // 等到 router 将可能的异步组件和钩子函数解析完
  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    // 设定title
    const currentRoute = router.currentRoute; // 获取当前路由信息
    const currentMeta = currentRoute.meta || {};
    const defaultTitle = 'vue-ts-example';
    context.title = currentMeta.title || defaultTitle;
    // 匹配不到的路由，执行 reject 函数，并返回 404
    if (!matchedComponents.length) {
      return reject({ code: 404 });
    }
    // 对所有匹配的路由组件调用 `asyncData()`
    Promise.all(matchedComponents.map(Component => {
      const methods = Component.options.methods || {};
      if (methods.asyncData) { // 调用 asyncData
        return methods.asyncData({
          store,
          route: currentRoute
        });
      }
    })).then(() => {
      context.state = store.state;
      // 新闻内页设置title信息
      if (currentRoute.name === 'newsContent') {
        const newContent = (context.state.news || {}).newContent || {};
        let title = '';
        Object.keys(newContent).forEach(id => {
          title = (newContent[id] || {}).title;
        });
        if (title) context.title = title;
      }
      resolve(app);
    }).catch(reject);
  }, reject);
});
