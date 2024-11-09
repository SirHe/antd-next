import getXlsxData from "./dist/xlsx.js"
import * as XLSX from "xlsx"
import Mock from "mockjs"
const Random = Mock.Random

export const getData = (total = 10) => {
  const data = []
  for (var i = 0; i < total; i++) {
    let obj = {
      id: Random.uuid(),
      name: Random.cname(),
      sex: Random.integer(0, 1),
      age: Random.integer(18, 50),
      city: Random.city(),
      region: Random.region(),
      email: Random.email()
    }
    data.push(obj)
  }
  return data
}

const data1 = getData(1000 * 1000)
console.log(data1.length)

const fn = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(v) {
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

console.time("Execution Time")
fn()
console.timeEnd("Execution Time")
