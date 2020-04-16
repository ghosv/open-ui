import React, { useState, useEffect } from 'react';
import { DocumentNode } from 'graphql';
import { Table } from 'antd';
import { useQuery } from '@apollo/react-hooks';

export default function useTable(LIST: DocumentNode, $: any, columns: any, row: any) {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useQuery(LIST, {
    variables: {
      word: '',
      size,
      page,
    },
  });
  useEffect(() => {
    refetch();
  }, [size, page]);

  const {total, list} = $(data)
  const l = list.map((...args: any) => row(refetch, ...args, data))

  const table = <Table
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

  return { table, fresh: refetch }
}
