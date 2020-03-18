import { request } from 'umi';

let base = '';
if (location.hostname === 'localhost' && location.host !== 'localhost:4000') {
  base = '/api';
}

export const register = data =>
  request(`${base}/register`, { method: 'post', data });
export const login = data => request(`${base}/login`, { method: 'post', data });
export const status = token =>
  request(`${base}/status`, {
    method: 'post',
    headers: { Authorization: token },
  });

export const postCode = params =>
  request(`${base}/notify/post/code`, {
    method: 'get',
    params,
  });
