import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import styles from './_pc.less';
import { Form, Input, Button, message } from 'antd';

import { gql } from 'apollo-boost';
const USER_INFO = gql`
  {
    user {
      nick
      avatar
      motto
      homepage
    }
  }
`;
const UPDATE = gql`
  mutation Update(
    $nick: String!
    $avatar: String!
    $motto: String!
    $homepage: String!
  ) {
    user: updateUser(
      nick: $nick
      avatar: $avatar
      motto: $motto
      homepage: $homepage
    ) {
      nick
      avatar
      motto
      homepage
    }
  }
`;

const rules = {
  nick: [
    {
      required: true,
      whitespace: true,
      message: 'Please input your nickname!',
    },
  ],
  url: [
    {
      type: 'url',
      message: 'Must be URL!',
    },
  ],
};

function useUser() {
  const { data, loading, error, refetch } = useQuery(USER_INFO);
  const [update] = useMutation(UPDATE);

  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState('');
  if (loading || error) {
    return <div>loading...</div>;
  }

  const onFinish = values => {
    update({ variables: values })
      .then(({ data: user }: any) => {
        if (user) {
          message.success({ content: 'Success' });
          refetch();
        }
      })
      .catch(e => {
        message.error({ content: e });
      });
  };
  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={data.user}
      scrollToFirstError
    >
      <Form.Item name="nick" label="Nickname" rules={rules.nick}>
        <Input />
      </Form.Item>
      <Form.Item noStyle>
        <Form.Item name="avatar" label="avatar" rules={rules.url}>
          <Input onChange={() => setAvatar(form.getFieldValue('avatar'))} />
        </Form.Item>
        <img
          src={avatar ? avatar : data.user.avatar}
          style={{
            height: '100px',
            width: '100px',
            marginBottom: '10px',
            borderRadius: '50%',
          }}
        />
      </Form.Item>
      <Form.Item name="motto" label="motto">
        <Input />
      </Form.Item>
      <Form.Item name="homepage" label="homepage" rules={rules.url}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
}

export default () => {
  const u = useUser();

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>个人资料</h1>
      {u}
    </div>
  );
};
