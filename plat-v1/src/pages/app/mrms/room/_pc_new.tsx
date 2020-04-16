import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import useSelect from '@/hooks/useSelect'

import { gql } from 'apollo-boost';
const CREATE = gql`
  mutation Create(
    $name: String!
    $addr: String!
    $devices: [String!]!
  ) {
    obj: createRoom(name: $name, addr: $addr, devices: $devices) {
      ID
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

export default function useNewPage(goto: any) {
  const [create] = useMutation(CREATE);

  const [form] = Form.useForm();
  const [devices, setDevices] = useState([])
  const {view: view1} = useSelect(DEVICE_LIST, ({
    devices: {
      list: data = []
    } = {},
  } = {}) => data, devices, setDevices, 'multiple')

  const onFinish = v => {
    const variables = {...v, devices: devices.map(v => v.value)}
    create({ variables })
      .then(({ data: { obj } }) => {
        if (obj && obj.ID) {
          form.resetFields()
          setDevices([])
          goto('list')
        }
      })
      .catch(e => {});
  }


  return (
    <div>
      <h1>New Room</h1>
      <br />

      <Form form={form} name="create" onFinish={onFinish} scrollToFirstError>
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
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};
