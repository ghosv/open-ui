import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input, DatePicker, TimePicker } from 'antd';
const { RangePicker } = DatePicker;

import useSelect from '@/hooks/useSelect'
import moment from 'moment';

import { gql } from 'apollo-boost';
const DATA = gql`
query Data($ID: ID!) {
  obj: meeting(ID: $ID) {
    name
    desc
    startTime
    endTime
    room {
      ID
      name
    }
    host {
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
const UPDATE = gql`
  mutation UPDATE(
    $ID: String!
    $name: String!
    $desc: String!
    $startTime: Timestamp!
    $endTime: Timestamp!
    $room: String!
    $host: String!
    $users: [String!]!
  ) {
    obj: updateMeeting(ID: $ID,
      name: $name, desc: $desc, startTime: $startTime, endTime: $endTime,
      room: $room, host: $host, users: $users) {
      ID
    }
  }
`;

export default function useEditPage(goto: any, id: any = '') {
  const [ load, { data, loading } ] = useLazyQuery(DATA);
  const [update] = useMutation(UPDATE);

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
    setRoom(obj.room?{
      key: obj.room.ID,
      value: obj.room.ID,
      label: obj.room.name,
    }:{})
    setHost(obj.host?{
      key: obj.host.UUID,
      value: obj.host.UUID,
      label: obj.host.nick,
    }:{})
    setUsers(obj.users ? obj.users.map(v => ({
      key: v.UUID,
      value: v.UUID,
      label: v.nick,
    })) : [])
    const { startTime, endTime, ...o } = obj
    form.setFieldsValue({
      ...o,
      time: [
        moment(startTime),
        moment(endTime),
      ]
    })
  }, [data]);

  if (loading) {
    return <div>loading...</div>
  }

  const onFinish = ({time, ...v}) => {
    const t = {
      startTime: time[0].unix()*1000,
      endTime: time[1].unix()*1000,
    }
    const variables = {...v, ...t, ID: id, room: room.value, host: host.value, users: users.map(v => v.value)}
    update({ variables })
      .then(({ data: { obj } }) => {
        goto('list')
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>Edit Meeting</h1>
      <br />

      <Form form={form} name="update" onFinish={onFinish} scrollToFirstError>
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
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
};
