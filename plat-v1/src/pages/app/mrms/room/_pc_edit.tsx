import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import useSelect from '@/hooks/useSelect'

import { gql } from 'apollo-boost';
const DATA = gql`
query Data($ID: ID!) {
  obj: room(ID: $ID) {
    name
    addr
    devices {
      ID
      name
    }
  }
}
`;
const DEVICE_LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  devices(word: $word, size: $size, page: $page) {
    list {
      ID
      name
    }
  }
}
`
const UPDATE = gql`
  mutation UPDATE(
    $ID: String!
    $name: String!
    $addr: String!
    $devices: [String!]!
  ) {
    obj: updateRoom(ID: $ID, name: $name, addr: $addr, devices: $devices) {
      ID
    }
  }
`;

export default function useEditPage(goto: any, id: any = '') {
  const [ load, { data, loading } ] = useLazyQuery(DATA);
  const [update] = useMutation(UPDATE);

  const [form] = Form.useForm();
  const [devices, setDevices] = useState([])
  const {view: view1} = useSelect(DEVICE_LIST, ({
    devices: {
      list: data = []
    } = {},
  } = {}) => data, devices, setDevices, 'multiple')

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
    setDevices(obj.devices ? obj.devices.map(v => ({
      key: v.ID,
      value: v.ID,
      label: v.name,
    })) : [])
    form.setFieldsValue(obj)
  }, [data]);

  if (loading) {
    return <div>loading...</div>
  }

  const onFinish = v => {
    const variables = {...v, ID: id, devices: devices.map(v => v.value)}
    update({ variables })
      .then(({ data: { obj } }) => {
        goto('list')
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>Edit Room</h1>
      <br />

      <Form form={form} name="update" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="name" label="名称" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="addr" label="位置" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="设备" rules={[{ require: true }]}>
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
