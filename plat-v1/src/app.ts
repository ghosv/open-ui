import { RequestConfig, getDvaApp } from 'umi';
import { notification } from 'antd';

export const request: RequestConfig = {
  errorConfig: {
    adaptor: res => {
      return {
        success: true,
        showType: 4,
        errorMessage: res.message ? res.message : res,
      };
    },
  },
  middlewares: [
    async (ctx, next) => {
      const store = getDvaApp()._store;
      const { token } = store.getState();
      ctx.req.options.headers['Authorization'] = `Bearer ${token}`;
      await next();
      if (ctx.res.code !== 0) {
        const { msg } = ctx.res;
        if (msg === 'LOGOUT') {
          store.dispatch({
            type: 'token/clean',
          });
        }
        if (msg) {
          notification.error({
            message: 'Request Error',
            description: msg,
          });
        } else {
          notification.error({
            message: 'Network Error/Request Error',
            description: 'Unknow Error',
          });
        }
      }
      // TODO: Set-Token
    },
  ],
};
