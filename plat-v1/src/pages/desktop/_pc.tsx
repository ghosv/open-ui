import React, { useState } from 'react';
import { connect } from 'umi';
import { useQuery } from '@apollo/react-hooks';
import styles from './_pc.less';

import { message } from 'antd';
import Navigation from './components/pc/Navigation';
import Icon from './components/pc/Icon';
import Window from './components/pc/Window';

import { gql } from 'apollo-boost';
import genURL from '@/services/core';

const APP_LIST = gql`
  {
    apps: myMarkApps {
      id
      icon
      name
      intro
      URL
    }
  }
`;

const LOAD_APP_LIST = 'LOAD_APP_LIST';

function useAppList() {
  const [active, setActive] = useState(-1);
  const [loaded, load] = useState(false);
  const { loading, error, data: { apps } = {} } = useQuery(APP_LIST);
  if (loading) {
    message.loading({ key: LOAD_APP_LIST, content: 'Loading Apps ...' });
    return [[]];
  }
  if (!loaded) {
    load(true);
    if (error) {
      setTimeout(
        () =>
          message.error({
            key: LOAD_APP_LIST,
            content: error.message,
          }),
        0,
      );
      return [[]];
    }
    setTimeout(
      () =>
        message.success({
          key: LOAD_APP_LIST,
          content: 'App List Loaded!',
        }),
      0,
    );
  }
  return [apps || [], active, setActive];
}

function useWindowStack(states, token) {
  const [stack, set] = useState(states);
  const open = app => {
    set([...stack, app]);
  };
  const close = index => {
    stack.splice(index, 1);
    set([...stack]);
  };
  return [stack, open, close];
}

function Desktop({ token }) {
  const [wins, open, close] = useWindowStack([], token);
  const winList = wins.map((app, index) => {
    // TODO:
    const url = genURL(
      `/authorize?id=${app.id}&token=${token}&redirect=${app.URL}`,
    );

    return (
      <Window
        key={app.appid + '_' + index}
        icon={app.icon}
        name={app.name}
        url={url}
        zIndex={1000 + index}
        close={() => close(index)}
      />
    );
  });

  const [apps, active, activeApp] = useAppList();
  const appList = apps.map((app, index) => {
    // TODO: 右键菜单 可以选择在新窗口打开 App

    return (
      <Icon
        key={app.id}
        {...app}
        active={index === active}
        onClick={e => {
          e.stopPropagation();
          activeApp(index);
        }}
        onDoubleClick={() => open(app)}
      />
    );
  });

  return (
    <div className={styles.desktop}>
      <Navigation />
      <div className={styles.main} onClick={() => activeApp(-1)}>
        {appList}
      </div>
      <div className={styles.wins}>{winList}</div>
    </div>
  );
}

export default connect(({ token }) => ({ token }))(Desktop);
