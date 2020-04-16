import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Button, Tooltip, message } from 'antd';
import {
  UsergroupAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { gql } from 'apollo-boost';
import useTable from '@/hooks/useTable'

const LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  groups(word: $word, size: $size, page: $page) {
    list {
      id
      name
      icon
      detail
      master {
        nick
      }
    }
    total
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
    key: 'detail',
    dataIndex: 'detail',
    title: '详情',
  },
  {
    key: 'master',
    dataIndex: 'master',
    title: '组长',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: '操作',
  },
];

const DELETE = gql`
  mutation Delete($ID: String!) {
    succ: deleteGroup(ID: $ID)
  }
`;

export default function useListPage(goto: any) {
  const [del] = useMutation(DELETE);

  const row = (refetch: any, v: any) => {
    const doDelete = (ID: any) => {
      del({ variables: { ID } }).then(({ data: { succ } }) => {
        if (succ) {
          message.success({ content: `Delete ${ID} Success` });
          refetch();
        }
      });
    };
    const { nick = '' } = v.master ? v.master : {}
    return {
      key: v.id,
      icon: <img style={{width: '36px'}} src={v.icon} />,
      name: v.name,
      detail: v.detail,
      master: nick,
      actions: (
        <div>
          <Tooltip title="edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => goto('edit', v.id)}
            />
          </Tooltip>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => doDelete(v.id)}
          />
        </div>
      ),
    };
  }

  const { table, fresh } = useTable(LIST, ({
    groups: {
      total = 0,
      list = [],
    } = {},
  } = {}) => ({total, list}), columns, row)

  const listPage = <div>
    <div style={{ marginBottom: '30px' }}>
      <Button icon={<UsergroupAddOutlined />} onClick={() => goto('new')}>
        Add
      </Button>
    </div>
    {table}
  </div>

  return {
    listPage,
    fresh,
  }
};
