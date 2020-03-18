// @ts-nocheck
import React, { useState } from 'react';
import styles from './_pc.less';
import { useIntl } from 'umi';

import { Card } from 'antd';
import LoginForm from './components/pc/LoginForm';
import RegisterForm from './components/pc/RegisterForm';

export default props => {
  const intl = useIntl();
  const [key, setKey] = useState('login');

  const tabList = [
    {
      key: 'login',
      tab: (
        <span className={styles.tab}>
          {intl.formatMessage({ id: 'page.login.login' })}
        </span>
      ),
    },
    {
      key: 'register',
      tab: (
        <span className={styles.tab}>
          {intl.formatMessage({ id: 'page.login.register' })}
        </span>
      ),
    },
  ];

  const contentList = {
    login: <LoginForm />,
    register: <RegisterForm />,
  };

  return (
    <div className={styles.container}>
      <Card
        title={intl.formatMessage({ id: 'site.title' })}
        headStyle={{ textAlign: 'center' }}
        tabList={tabList}
        activeTabKey={key}
        onTabChange={key => setKey(key)}
      >
        {contentList[key]}
      </Card>
    </div>
  );
};
