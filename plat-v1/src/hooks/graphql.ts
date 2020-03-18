import { getDvaApp } from 'umi';
import { useQuery as _useQuery } from '@apollo/react-hooks';

const LOGOUT = 'GraphQL error: Logout';

export default function useQuery(...args) {
  const store = getDvaApp()._store;
  const res = _useQuery(...args);
  // console.log(res)
  if (res.error && res.error.message === LOGOUT) {
    store.dispatch({ type: 'token/clean' });
    res.error.message = 'Logout';
  }
  return res;
}
