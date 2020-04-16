// @ts-nocheck
import React from 'react';
import { connect, useHistory, useLocation, getDvaApp } from 'umi';

import { ApolloProvider } from '@apollo/react-hooks';
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable, from } from 'apollo-link';
import { onError } from 'apollo-link-error';

//const httpLink = new HttpLink({ uri: '/graphql' });
const httpLink = new HttpLink({ uri: `http://${window.document.location.hostname}:4002/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
  const store = getDvaApp()._store;
  const { token } = store.getState();
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

//const refreshMiddleware = new ApolloLink((operation, forward) =>
//  new Observable(observer => {
//    const handle = forward(operation).subscribe({
//      next(result) {
//        const { headers } = operation.getContext().response
//        console.log(headers, result)
//        // TODO: Set-Token 无法实现，在新架构上使用 Client 主动刷新！
//        observer.next(result);
//      },
//      error: observer.error.bind(observer),
//      completeo: observer.complete.bind(observer)
//    });
//    return () => {
//      if (handle) handle.unsubscribe();
//    };
//  })
//)

import { notification } from 'antd';
const logoutLink = onError(res => {
  const store = getDvaApp()._store;
  const { graphQLErrors, networkError } = res;
  if (graphQLErrors) {
    for (let i in graphQLErrors) {
      if (graphQLErrors[i].message === "401") {
        store.dispatch({ type: 'token/clean' });
        return
      }
    }
    notification.error({
      message: 'Request Error',
      description: graphQLErrors[0].message,
    });
    return;
  }
  if (networkError.statusCode === 401) {
    store.dispatch({ type: 'token/clean' });
  }
});

const cache = new InMemoryCache();
const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  link: from([
    authMiddleware,
    // refreshMiddleware,
    logoutLink,
    httpLink,
  ]),

  connectToDevTools: true,
});

const Auth = ({ token, children }) => {
  const { pathname, search } = useLocation();
  const history = useHistory();
  if (token) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  } else {
    // @ts-ignore
    history.replace({
      pathname: '/login',
      query: {
        redirect: pathname + search,
      },
    });
    return <div />;
  }
};

export default connect(({ token }) => ({ token }))(Auth);
