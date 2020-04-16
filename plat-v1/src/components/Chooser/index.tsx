import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import { debounce } from 'lodash';
const { Option } = Select;
import { useLazyQuery } from '@apollo/react-hooks';

import { gql } from 'apollo-boost';
const LIST = gql`
  query List($word: String!, $size: Int, $page: Int) {
    users(word: $word, size: $size, page: $page) {
      list {
        UUID
        name
        nick
      }
    }
  }
`

export default () => {
  const [value, setValue] = useState([])
  const handleChange = (value: any) => setValue(value)

  const [getList, {
    loading,
    data: {
      users: {
        list: data = []
      } = {},
    } = {},
  }] = useLazyQuery(LIST)

  const fetch = debounce((value: any) => getList({
    variables: {
      word: value,
      size: 10,
      page: 1,
    }
  }), 800)

  return (
    <Select
      mode="multiple"
      labelInValue
      value={value}
      placeholder="Select users"
      notFoundContent={loading ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={fetch}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {data.map(d => (
        <Option key={d.UUID}>{d.nick}</Option>
      ))}
    </Select>
  )
}
