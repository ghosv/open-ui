import React, { useState, useEffect } from 'react';
import { connect } from 'umi';

import styles from './Navigation.less';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const Navigation = ({ dispatch }) => {
  const [date, setDate] = useState(new Date());
  const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  useEffect(() => {
    const t = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(t);
    };
  });

  const logout = () => {
    dispatch({ type: 'token/clean' });
  };

  return (
    <div className={styles.container}>
      <div style={{ color: '#fff' }}>Ghost</div>
      <div className={styles.time}>{time}</div>
      <Button
        type="danger"
        size="small"
        shape="circle"
        icon={<LogoutOutlined />}
        onClick={logout}
      />
    </div>
  );
};

export default connect()(Navigation);
