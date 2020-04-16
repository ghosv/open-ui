import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import useSelect from '@/hooks/useSelect'

import { gql } from 'apollo-boost';
const DATA = gql`
query Data($ID: String!) {
  group(ID: $ID) {
    name
    icon
    detail
    master {
      UUID
      nick
    }
    users {
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
    $icon: String!
    $detail: String!
    $master: String!
    $users: [String!]!
  ) {
    group: updateGroup(ID: $ID, name: $name, icon: $icon, detail: $detail, master: $master) {
      id
    }
    join: inviteJoinGroup(ID: $ID, users: $users) { id }
  }
`;

export default function useEditPage(goto: any, id: any = '') {
  const [ load, { data, loading } ] = useLazyQuery(DATA);
  const [master, setMaster] = useState({})
  const [users, setUsers] = useState([])

  const [form] = Form.useForm();
  const {view: view1} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, master, setMaster)
  const {view: view2} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, users, setUsers, 'multiple')

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
    const { group = {} } = data ? data : {}
    setMaster(group.master?{
      key: group.master.UUID,
      value: group.master.UUID,
      label: group.master.nick,
    }:{})
    setUsers(group.users ? group.users.map(v => ({
      key: v.UUID,
      value: v.UUID,
      label: v.nick,
    })) : [])
    form.setFieldsValue(group)
  }, [data]);
  const [update] = useMutation(UPDATE);

  if (loading) {
    return <div>loading...</div>
  }

  console.log("m", master)
  const onFinish = v => {
    const variables = {...v, ID: id, master: master.value, users: users.map(v => v.value)}
    console.log(variables)
    update({ variables })
      .then(({ data: { group } }) => {
        goto('list')
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>Edit Group</h1>
      <br />

      <Form form={form} name="update" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="name" label="Name" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="Icon" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="detail" label="Detail" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Master" >
          {view1}
        </Form.Item>
        <Form.Item label="Member" >
          {view2}
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
