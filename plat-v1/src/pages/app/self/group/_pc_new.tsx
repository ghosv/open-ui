import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Button, Form, Input } from 'antd';

import { gql } from 'apollo-boost';
const CREATE = gql`
  mutation Create(
    $name: String!
    $icon: String!
    $detail: String!
  ) {
    group: createGroup(name: $name, icon: $icon, detail: $detail) {
      id
    }
  }
`;

export default function useNewPage(goto: any) {
  const [form] = Form.useForm();
  const [create] = useMutation(CREATE);

  const onFinish = v => {
    create({ variables: v })
      .then(({ data: { group } }) => {
        if (group && group.id) {
          form.resetFields()
          goto('list')
        }
      })
      .catch(e => {});
  }

  return (
    <div>
      <h1>New Group</h1>
      <br />

      <Form form={form} name="create" onFinish={onFinish} scrollToFirstError>
        <Form.Item name="name" label="Name" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="Icon" rules={[{ require: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="detail" label="Detail" rules={[{ require: true }]}>
          <Input />
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
