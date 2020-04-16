import React, { useState } from 'react';

import useListPage from './_pc_list'
import useNewPage from './_pc_new'
import useEditPage from './_pc_edit'

export default () => {
  const [p, setPage] = useState('list')
  const [params, setParams] = useState()
  const goto = (page: string, params?: any) => {
    if (!page) {
      page = 'list'
    } else if (page === 'list') {
      fresh()
    }
    setPage(page)
    setParams(params)
  }
  const { listPage, fresh } = useListPage(goto)
  const newPage = useNewPage(goto)
  const editPage = useEditPage(goto, params)

  const pages: any = {
    list: listPage,
    new: newPage,
    edit: editPage,
  }
  return (
    <div>
      {pages[p]}
    </div>
  );
};
