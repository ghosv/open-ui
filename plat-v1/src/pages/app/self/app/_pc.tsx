import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import styles from './_pc.less';
import { Table, Button, Tooltip, Modal, Form, Input, message } from 'antd';
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons';

import { gql } from 'apollo-boost';
const APP_LIST = gql`
  query List($word: String!, $size: Int, $page: Int) {
    user {
      UUID
    }
    apps(word: $word, size: $size, page: $page) {
      total
      list {
        id
        icon
        name
        intro

        owner {
          UUID
        }
        users {
          UUID
        }

        key
        secret
      }
    }
  }
`;
const DELETE_APP = gql`
  mutation Delete($ID: String!) {
    succ: deleteApp(ID: $ID)
  }
`;
const MARK_APP = gql`
  mutation Mark($ID: String!) {
    app: markApp(ID: $ID) {
      name
    }
  }
`;
const UNMARK_APP = gql`
  mutation Unmark($ID: String!) {
    app: unmarkApp(ID: $ID) {
      name
    }
  }
`;

const columns = [
  {
    key: 'icon',
    dataIndex: 'icon',
    title: 'Icon',
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
  },
  {
    key: 'intro',
    dataIndex: 'intro',
    title: '简介',
  },
  {
    key: 'secret',
    dataIndex: 'secret',
    title: 'ID/Key/Secret',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: '操作',
  },
];

function useList() {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useQuery(APP_LIST, {
    variables: {
      word: '',
      size,
      page,
    },
  });
  useEffect(() => {
    refetch();
  }, [size, page]);
  const { user: { UUID = '' } = {}, apps: { total = 0, list = [] } = {} } = data
    ? data
    : {};

  const [deleteApp] = useMutation(DELETE_APP);
  const doDeleteApp = ID => {
    deleteApp({ variables: { ID } }).then(({ data: { succ } }) => {
      if (succ) {
        message.success({ content: `Delete ${ID} Success` });
        refetch();
      }
    });
  };
  const [mark] = useMutation(MARK_APP);
  const doMark = ID => {
    mark({ variables: { ID } }).then(({ data: { app } }) => {
      if (app) {
        message.success({ content: `Mark ${app.name} Success` });
        refetch();
      }
    });
  };
  const [unmark] = useMutation(UNMARK_APP);
  const doUnmark = ID => {
    unmark({ variables: { ID } }).then(({ data: { app } }) => {
      if (app) {
        message.success({ content: `Unmark ${app.name} Success` });
        refetch();
      }
    });
  };

  const l = list.map(v => {
    const isOwner = v.owner && v.owner.UUID === UUID;
    const inDesktop =
      v.id === 'open.srv.self' ||
      (v.users || []).reduce((l, v) => l || v.UUID === UUID, false);
    const canRemove = v.id !== 'open.srv.self' && inDesktop;

    return {
      key: v.id,
      secret: v.key ? (
        <div>
          ID: {v.id}
          <br />
          K: {v.key}
          <br />
          S: {v.secret}
          <br />
        </div>
      ) : (
        ''
      ),
      name: v.name,
      intro: v.intro,
      icon: <img style={{width: '36px'}} src={v.icon} />,
      actions: (
        <div>
          {isOwner ? (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => doDeleteApp(v.id)}
            />
          ) : (
            ''
          )}
          {inDesktop ? (
            ''
          ) : (
            <Tooltip title="mark">
              <Button
                icon={<PlusSquareOutlined />}
                onClick={() => doMark(v.id)}
              />
            </Tooltip>
          )}
          {canRemove ? (
            <Tooltip title="unmark">
              <Button
                icon={<MinusSquareOutlined />}
                onClick={() => doUnmark(v.id)}
              />
            </Tooltip>
          ) : (
            ''
          )}
        </div>
      ),
    };
  });
  const table = (
    <Table
      columns={columns}
      dataSource={l}
      pagination={{
        // hideOnSinglePage: true,
        showSizeChanger: true,
        total,
        current: page,
        pageSize: size,
        pageSizeOptions: ['5', '10', '20', '50'],
        onChange: setPage,
        onShowSizeChange(_, size) {
          setPage(1);
          setSize(size);
        },
      }}
    />
  );
  return {
    list: table,
    fresh: refetch,
  };
}

const CREATE_APP = gql`
  mutation CreateApp(
    $name: String!
    $icon: String!
    $intro: String!
    $URL: String!
  ) {
    app: createApp(name: $name, icon: $icon, intro: $intro, URL: $URL) {
      id
      key
      secret
    }
  }
`;

export default () => {
  const { list, fresh } = useList();

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
  };
  const [create] = useMutation(CREATE_APP);
  const onFinish = v => {
    create({ variables: v })
      .then(({ data: { app } }) => {
        if (app) {
          fresh();
          setVisible(false);
        }
      })
      .catch(e => {});
  };

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Button icon={<AppstoreAddOutlined />} onClick={() => setVisible(true)}>
          Add
        </Button>
      </div>
      <Modal
        title="New App"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} name="create" onFinish={onFinish} scrollToFirstError>
          <Form.Item name="name" label="Name" rules={[{ require: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="Icon" rules={[{ require: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="intro" label="Intro" rules={[{ require: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="URL" label="URL" rules={[{ require: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal></Modal>

      {list}
    </div>
  );
};
