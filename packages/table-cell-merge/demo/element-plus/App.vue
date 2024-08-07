<template>
  <el-table :data="table.dataSource" :span-method="table.spanMethod" border>
    <el-table-column
      v-for="column in table.columns"
      :key="column.dataIndex"
      :prop="column.dataIndex"
      :label="column.title"
    />
  </el-table>
</template>

<script lang="ts" setup>
import { reactive } from "vue"
import { getData } from "../../mock"
import wrapperTable from "../../render/element-plus"
import type { TableColumnCtx } from "element-plus"

const columns = [
  {
    title: "ID",
    dataIndex: "id",
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
let data = getData(10)
data = data.map((v) => ({ ...v, id: v.id.slice(-6) }))
const { dataSource, spanMethod } = wrapperTable(data, columns)
const table = reactive({ dataSource, spanMethod, columns })

const arraySpanMethod = ({ rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}
</script>
