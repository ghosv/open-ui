// @ts-nocheck
import React from 'react';
import { connect, useHistory, useLocation, getDvaApp } from 'umi';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/graphql',
  request: operation => {
    const store = getDvaApp()._store;
    const { token } = store.getState();
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
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
