import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import useSelect from '@/hooks/useSelect'

import { gql } from 'apollo-boost';
const CREATE = gql`
  mutation Create(
    $name: String!
    $type: String!
    $owner: String!
  ) {
    obj: createDevice(name: $name, type: $type, owner: $owner) {
      ID
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

export default function useNewPage(goto: any) {
  const [create] = useMutation(CREATE);

  const [form] = Form.useForm();
  const [owner, setOwner] = useState({})
  const {view: view1} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, owner, setOwner)

  const onFinish = v => {
    const variables = {...v, owner: owner.value}
    create({ variables })
      .then(({ data: { obj } }) => {
        if (obj && obj.ID) {
          form.resetFields()
          setOwner({})
          goto('list')
        }
      })
      .catch(e => {});
  }


  return (
    <div>
      <h1>New Device</h1>
      <br />

      <Form form={form} name="create" onFinish={onFinish} scrollToFirstError>
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
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};
