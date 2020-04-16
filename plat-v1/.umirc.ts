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

    {
      path: '/app/self',
      component: '@/layouts/self/index',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          exact: true,
          path: '/app/self',
          redirect: '/app/self/dashboard',
        },
        {
          exact: true,
          path: '/app/self/dashboard',
          component: '@/pages/app/self/dashboard/index',
        },

        {
          exact: true,
          path: '/app/self/user',
          component: '@/pages/app/self/user/index',
        },
        {
          exact: true,
          path: '/app/self/app',
          component: '@/pages/app/self/app/index',
        },
        {
          exact: true,
          path: '/app/self/org',
          component: '@/pages/app/self/org/index',
        },
        {
          exact: true,
          path: '/app/self/group',
          component: '@/pages/app/self/group/index',
        },

        { component: '@/pages/404' },
      ],
    },

    {
      path: '/app/mrms',
      component: '@/layouts/mrms/index',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          exact: true,
          path: '/app/mrms',
          redirect: '/app/mrms/dashboard',
        },
        {
          exact: true,
          path: '/app/mrms/dashboard',
          component: '@/pages/app/mrms/dashboard/index',
        },

        {
          exact: true,
          path: '/app/mrms/room',
          component: '@/pages/app/mrms/room/index',
        },
        {
          exact: true,
          path: '/app/mrms/device',
          component: '@/pages/app/mrms/device/index',
        },
        {
          exact: true,
          path: '/app/mrms/meeting',
          component: '@/pages/app/mrms/meeting/index',
        },

        { component: '@/pages/404' },
      ],
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
