// @ts-nocheck
import { dynamic } from 'umi';

function isMobile() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.match(/(iphone|ipod|ipad|android)/);
}

export default (pc, mobile) =>
  dynamic({
    loader: async () => {
      if (isMobile()) {
        return await mobile;
      }
      return await pc;
    },
  });
