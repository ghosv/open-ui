import React, { useState } from 'react';
import { connect, useHistory, useLocation } from 'umi';

import styles from './LoginForm.less';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { login } from '@/services/core';

const conf = {
  username: {
    rules: [
      {
        required: true,
        message: 'Please input your username/phone/email!',
      },
    ],
    placeholder: 'Username/Phone/E-mail',
  },
  password: {
    rules: [
      {
        required: true,
        message: 'Please input your password!',
      },
    ],
    placeholder: 'Password',
  },
};

const LoginForm = ({ dispatch }) => {
  const {
    query: { redirect = '/' },
  } = useLocation();
  const history = useHistory();

  const onFinish = async ({ username: name, password: pass, remember }) => {
    const res = await login({ name, pass });
    if (res.code === 0) {
      const { token } = res.data;
      dispatch({
        type: 'token/set',
        token,
        remember,
      });
      history.replace(redirect);
    }
  };

  return (
    <Form
      className={styles.loginForm}
      name="login"
      onFinish={onFinish}
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item name="username" rules={conf.username.rules}>
        <Input
          prefix={<UserOutlined />}
          placeholder={conf.username.placeholder}
        />
      </Form.Item>
      {/* TODO: use code replace password, when use phone&email */}
      <Form.Item name="password" rules={conf.password.rules}>
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={conf.password.placeholder}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        {/* TODO
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
        */}
      </Form.Item>

      <Form.Item>
        <Button
          className={styles.loginFormButton}
          type="primary"
          htmlType="submit"
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect()(LoginForm);
