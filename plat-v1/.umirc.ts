import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  dynamicImport: {},
  locale: {
    default: 'zh-CN',
    antd: true,
    title: true,
    baseNavigator: true,
  },
  dva: {},
  antd: {
    dark: true,
  },

  // base: '/plat',
  history: {
    type: 'hash',
  },
  publicPath: '/plat/',

  devServer: {
    port: 3001,
  },
  analyze: {
    analyzerPort: 5001,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/graphql': {
      target: 'http://localhost:4000',
      changeOrigin: true,
    },
  },

  title: 'Ghost Open Platform',
  routes: [
    {
      exact: true,
      path: '/',
      redirect: '/desktop',
    },
    {
      exact: true,
      path: '/login',
      title: 'site.title.login',
      component: '@/pages/login/index',
    },
    {
      exact: true,
      path: '/desktop',
      component: '@/pages/desktop/index',
      wrappers: ['@/wrappers/auth'],
    },
    { exact: true, path: '/goto', component: '@/pages/desktop/index' }, // TODO
    { component: '@/pages/404' },
  ],
  // TODO:
  //qiankun: {
  //  master: {
  //    apps: [],
  //    jsSandbox: true,
  //    prefetch: true,
  //  },
  //},
});
