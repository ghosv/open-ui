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

function toLen(s, l = 2) {
  while (s.length < l) s = `0${s}`
  return s
}

function formatTime(T: number) {
  if (!T || T==0) {
      return
  }
  const t = new Date(T)
  const y = toLen(`${t.getFullYear()}`, 4)
  const M = toLen(`${t.getMonth()+1}`)
  const d = toLen(`${t.getDate()}`)
  const h = toLen(`${t.getHours()}`)
  const m = toLen(`${t.getMinutes()}`)
  const s = toLen(`${t.getSeconds()}`)
  let S =  toLen(`${t.getMilliseconds()}`, 3)
  return `${y}-${M}-${d} ${h}:${m}:${s}`
}

const LIST = gql`
query List($word: String!, $size: Int, $page: Int) {
  obj: meetings(word: $word, size: $size, page: $page) {
    list {
      ID
      name
      desc
      startTime
      endTime
      host {
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
    key: 'desc',
    dataIndex: 'desc',
    title: '描述',
  },
  {
    key: 'time',
    dataIndex: 'time',
    title: '时间',
  },
  {
    key: 'host',
    dataIndex: 'host',
    title: '主持人',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: '操作',
  },
];

const DELETE = gql`
  mutation Delete($ID: String!) {
    succ: deleteMeeting(ID: $ID)
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
    const { nick = '' } = v.host ? v.host : {}
    return {
      key: v.ID,
      name: v.name,
      desc: v.desc,
      time: `${formatTime(v.startTime)} ~ ${formatTime(v.endTime)}`,
      host: nick,
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
