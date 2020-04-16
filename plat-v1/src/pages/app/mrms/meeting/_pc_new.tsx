import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input, DatePicker, TimePicker } from 'antd';
const { RangePicker } = DatePicker;

import useSelect from '@/hooks/useSelect'
import moment from 'moment';

import { gql } from 'apollo-boost';
const CREATE = gql`
  mutation Create(
    $name: String!
    $desc: String!
    $startTime: Timestamp!
    $endTime: Timestamp!
    $room: String!
    $host: String!
    $users: [String!]!
  ) {
    obj: createMeeting(
      name: $name, desc: $desc, startTime: $startTime, endTime: $endTime,
      room: $room, host: $host, users: $users) {
      ID
    }
  }
`;

const ROOM_LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  rooms(word: $word, size: $size, page: $page) {
    list {
      ID
      name
    }
  }
}
`
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
  const [room, setRoom] = useState({})
  const [host, setHost] = useState({})
  const [users, setUsers] = useState([])
  const {view: view0} = useSelect(ROOM_LIST, ({
    rooms: {
      list: data = []
    } = {},
  } = {}) => data, room, setRoom)
  const {view: view1} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, host, setHost)
  const {view: view2} = useSelect(USER_LIST, ({
    users: {
      list: data = []
    } = {},
  } = {}) => data, users, setUsers, 'multiple')

  const onFinish = ({time, ...v}) => {
    const t = {
      startTime: time[0].unix()*1000,
      endTime: time[1].unix()*1000,
    }
    const variables = {...v, ...t, room: room.value, host: host.value, users: users.map(v => v.value)}
    create({ variables })
      .then(({ data: { obj } }) => {
        if (obj && obj.ID) {
          form.resetFields()
          setRoom({})
          setHost({})
          setUsers([])
          goto('list')
        }
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>New Meeting</h1>
      <br />

      <Form form={form} name="create" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="name" label="名称" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="desc" label="描述" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="time" label="会议时间">
          <RangePicker
            ranges={{Today: [moment(), moment()]}}
            showTime format="YYYY/MM/DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="会议室" rules={[{ require: true }]}>
          {view0}
        </Form.Item>
        <Form.Item label="主持人" rules={[{ require: true }]}>
          {view1}
        </Form.Item>
        <Form.Item label="与会者" rules={[{ require: true }]}>
          {view2}
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
