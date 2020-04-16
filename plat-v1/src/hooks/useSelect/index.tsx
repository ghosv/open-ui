import React from 'react';
import { Select, Spin } from 'antd';
import { debounce } from 'lodash';
const { Option } = Select;
import { useLazyQuery } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';

export default function useSelect(
    LIST: DocumentNode, $: any,
    value: any,
    setValue: any,
    mode?: "multiple" | "tags") {

  const [getList, {
    loading,
    data: _data,
  }] = useLazyQuery(LIST)
  const data = $(_data)

  const fetch = debounce((value: any) => getList({
    variables: {
      word: value,
      size: 10,
      page: 1,
    }
  }), 800)

  const view = <Select
    showSearch
    mode={mode}
    labelInValue
    value={value}
    placeholder="Please Select"
    notFoundContent={loading ? <Spin size="small" /> : null}
    filterOption={false}
    onSearch={fetch}
    onChange={setValue}
    style={{ width: '100%' }}
  >
    {data.map(d => (
      <Option key={d.UUID?d.UUID:d.ID}>{d.nick?d.nick:d.name}</Option>
    ))}
  </Select>

  return {
    view,
  }
}
