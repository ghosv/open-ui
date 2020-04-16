import React, { useState } from 'react';
import { useHistory, useLocation } from 'umi';

import styles from './_pc.less';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ProfileOutlined,
  AppstoreOutlined,
  PartitionOutlined,
  GroupOutlined,
  UngroupOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuData = [
  {
    key: '/app/self/dashboard',
    icon: <HomeOutlined />,
    title: 'Dashboard',
  },
  {
    key: '/app/self/user',
    icon: <ProfileOutlined />,
    title: 'Profile',
  },
  {
    key: '/app/self/app',
    icon: <AppstoreOutlined />,
    title: 'App Store',
  },
  // TODO
  // {
  //   key: '/app/self/org',
  //   icon: <PartitionOutlined />,
  //   title: 'Organization',
  // },
  {
    key: '/app/self/group',
    icon: <GroupOutlined />,
    title: 'Group',
  },
];

const SelfLayout = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const h = useHistory();
  const l = useLocation();

  const menu = menuData.map(v => (
    <Menu.Item key={v.key} onClick={() => h.push(v.key)}>
      {v.icon}
      <span>{v.title}</span>
    </Menu.Item>
  ));

  const trigger = React.createElement(
    collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
    {
      className: 'trigger',
      onClick() {
        setCollapsed(!collapsed);
      },
    },
  );

  return (
    <Layout className={styles.container}>
      <Sider
        className={styles.sider}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles.logo}>{collapsed ? '' : '个人中心'}</div>
        <Menu
          /* theme="dark" */ mode="inline"
          defaultSelectedKeys={[l.pathname]}
        >
          {menu}
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>{trigger}</Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default SelfLayout;
