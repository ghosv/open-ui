import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import useSelect from '@/hooks/useSelect'

import { gql } from 'apollo-boost';
const DATA = gql`
query Data($ID: ID!) {
  obj: device(ID: $ID) {
    name
    type
    owner {
      UUID
      nick
    }
  }
}
`;
const USER_LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  users(word: $word, size: $size, page: $page) {
    list {
      UUID
      nick
    }
  }
}
`
const UPDATE = gql`
  mutation UPDATE(
    $ID: String!
    $name: String!
    $type: String!
    $owner: String!
  ) {
    obj: updateDevice(ID: $ID, name: $name, type: $type, owner: $owner) {
      ID
    }
  }
`;

export default function useEditPage(goto: any, id: any = '') {
  const [ load, { data, loading } ] = useLazyQuery(DATA);
  const [update] = useMutation(UPDATE);

  const [form] = Form.useForm();
  const [owner, setOwner] = useState({})
  const {view: view1} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, owner, setOwner)

  useEffect(() => {
    if (id) {
      load({
        variables: {
          ID: id,
        },
      })
    }
  }, [id]);
  useEffect(() => {
    const { obj = {} } = data ? data : {}
    setOwner(obj.owner?{
      key: obj.owner.UUID,
      value: obj.owner.UUID,
      label: obj.owner.nick,
    }:{})
    form.setFieldsValue(obj)
  }, [data]);

  if (loading) {
    return <div>loading...</div>
  }

  const onFinish = v => {
    const variables = {...v, ID: id, owner: owner.value}
    update({ variables })
      .then(({ data: { obj } }) => {
        goto('list')
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>Edit Device</h1>
      <br />

      <Form form={form} name="update" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="name" label="名称" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="负责人" rules={[{ require: true }]}>
          {view1}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button htmlType="button" onClick={() => goto()}>
            Go Back
          </Button>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};
