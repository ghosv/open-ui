import React, { useState, useEffect } from 'react';
import { connect, useHistory, useLocation, useRequest } from 'umi';
import { usePostCode } from '@/hooks';

import { Form, Input, Button, Checkbox, Select, Modal } from 'antd';

import { register, postCode } from '@/services/core';

const prefixSelector = (
  <Form.Item name="phonePrefix" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="86">+86</Select.Option>
    </Select>
  </Form.Item>
);

const isLetter = v => ('a' <= v && v <= 'z') || ('A' <= v && v <= 'Z');
const validateUsername = (rule, value) => {
  if (value && !isLetter(value[0])) {
    return Promise.reject('Username must start with a letter!');
  }
  return Promise.resolve();
};

const compareToFirstPassword = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (value && value !== getFieldValue('password')) {
      return Promise.reject('The two passwords that you entered do not match!');
    }
    return Promise.resolve();
  },
});

const rules = {
  username: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your username!',
    },
    {
      validator: validateUsername,
    },
  ],
  nickname: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your nickname!',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please input your password!',
    },
    {
      min: 6,
      message: 'Length of Password must be greater than 6!',
    },
  ],
  confirm: [compareToFirstPassword],
  phone: [
    {
      required: true,
      message: 'Please input your phone number!',
    },
  ],
  phoneCode: [
    {
      required: true,
      message: 'Please input your Code!',
    },
  ],
  email: [
    {
      required: true,
      message: 'Please input your E-mail!',
    },
    {
      type: 'email',
      message: 'The input is not valid E-mail!',
    },
  ],
  emailCode: [
    {
      required: true,
      message: 'Please input your Code!',
    },
  ],
};

const RegisterForm = ({ dispatch }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const readAgreement = () => setVisible(true);
  const handleCancel = () => setVisible(false);
  const handleOk = () => {
    setAgreed(true);
    setVisible(false);
  };

  const {
    query: { redirect = '/' },
  } = useLocation();
  const history = useHistory();

  const onFinish = async values => {
    if (!agreed) {
      readAgreement();
      return;
    }
    const {
      username: name,
      password: pass,
      phonePrefix, // TODO: 手机区号
      phone,
      phoneCode,
      email,
      emailCode,
      nickname,
    } = values;
    const res = await register({
      name,
      pass,
      phone,
      phoneCode,
      email,
      emailCode,
      nickname, // TODO: check
    });
    if (res.code === 0) {
      const { token } = res.data;
      dispatch({
        type: 'token/set',
        token,
        remember: true,
      });
      history.replace(redirect);
    }
  };

  const [phoneCodeCD, sendPhoneCode] = usePostCode(() =>
    form.getFieldValue('phone'),
  );
  const [emailCodeCD, sendEmailCode] = usePostCode(
    () => form.getFieldValue('email'),
    'email',
  );

  return (
    <div>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          phonePrefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item name="username" label="Username" rules={rules.username}>
          <Input />
        </Form.Item>
        <Form.Item name="nickname" label="Nickname" rules={rules.nickname}>
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          hasFeedback
          rules={rules.password}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          required
          rules={rules.confirm}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="phone" label="Phone" rules={rules.phone}>
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="phoneCode"
          label="Confirm Phone"
          extra="Please keep it secret!"
          rules={rules.phoneCode}
        >
          <Input
            addonAfter={
              <Button
                type="link"
                disabled={phoneCodeCD > 0}
                onClick={sendPhoneCode}
              >
                {phoneCodeCD === 0 ? 'Get Code' : `${phoneCodeCD} s`}
              </Button>
            }
          />
        </Form.Item>

        <Form.Item name="email" label="E-mail" rules={rules.email}>
          <Input />
        </Form.Item>
        <Form.Item
          name="emailCode"
          label="Confirm E-mail"
          extra="Please keep it secret!"
          rules={rules.emailCode}
        >
          <Input
            addonAfter={
              <Button
                type="link"
                disabled={emailCodeCD > 0}
                onClick={sendEmailCode}
              >
                {emailCodeCD === 0 ? 'Get Code' : `${emailCodeCD} s`}
              </Button>
            }
          />
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={agreed}
            onChange={e => {
              setAgreed(e.target.checked);
            }}
          >
            I have read the
          </Checkbox>
          <a onClick={readAgreement}>agreement</a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ width: '100%' }} htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Agreement"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* TODO */}
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default connect()(RegisterForm);
