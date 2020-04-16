import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Button, Tooltip, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { gql } from 'apollo-boost';
import useTable from '@/hooks/useTable'

const LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  obj: devices(word: $word, size: $size, page: $page) {
    list {
      ID
      name
      type
      owner {
        nick
      }
    }
    total
  }
}
`;

const columns = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '名称',
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '类型',
  },
  {
    key: 'owner',
    dataIndex: 'owner',
    title: '负责人',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: '操作',
  },
];

const DELETE = gql`
  mutation Delete($ID: String!) {
    succ: deleteDevice(ID: $ID)
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
    const { nick = '' } = v.owner ? v.owner : {}
    return {
      key: v.ID,
      name: v.name,
      type: v.type,
      owner: nick,
      actions: (
        <div>
          <Tooltip title="edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => goto('edit', v.ID)}
            />
          </Tooltip>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => doDelete(v.ID)}
          />
        </div>
      ),
    };
  }

  const { table, fresh } = useTable(LIST, ({
    obj: {
      total = 0,
      list = [],
    } = {},
  } = {}) => ({total, list}), columns, row)

  const listPage = <div>
    <div style={{ marginBottom: '30px' }}>
      <Button icon={<PlusOutlined />} onClick={() => goto('new')}>
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
