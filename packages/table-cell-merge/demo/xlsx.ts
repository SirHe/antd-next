import * as XLSX from "xlsx"
import { getData } from "../mock/index"
import getXlsxData from "../render/xlsx"

const data1 = getData(10)

export default () => {
  const columns = [
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

  const tableName = "excel"
  const { data, merges } = getXlsxData(data1, columns)
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  // 合并单元格
  worksheet["!merges"] = merges
  // 创建一个新的工作簿
  const workbook = XLSX.utils.book_new()
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
  // 导出 Excel 文件
  XLSX.writeFile(workbook, `${tableName}.xlsx`)
}
