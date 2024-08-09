import React from "react"
import { Table } from "antd"
import { getData } from "../../mock"
import wrapperTable from "../../render/antd"

const data = getData(10)

const App = () => {
  const _columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(v: string) {
        return v.slice(-6)
      },
      isMerge: false
    },
    {
      title: "地区",
      dataIndex: "region"
    },
    {
      title: "姓名",
      dataIndex: "name",
      isMerge: false
    },
    {
      title: "性别",
      dataIndex: "sex"
    },
    {
      title: "年龄",
      dataIndex: "age"
    },
    {
      title: "城市",
      dataIndex: "city"
    },
    {
      title: "邮件",
      dataIndex: "email"
    }
  ]
  const { dataSource, columns } = wrapperTable(data, _columns)

  return <Table bordered columns={columns} dataSource={dataSource} />
}

export default App
