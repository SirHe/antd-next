import getMergeList from "../core"
import { suffixToPrefix } from "../core/utils"
import Matrix from "../core/matrix"

/**
 *  这一块内容与table进行一个强绑定，负责将合并信息渲染到table视图上
 */
export default (dataSource: Array<object>, columns: Array<any>) => {
  dataSource = getMergeList(
    dataSource,
    columns.map((v: any) => ({ dataIndex: v.dataIndex, isMerge: v.isMerge }))
  )
  dataSource = suffixToPrefix(dataSource)
  const matrix = new Matrix(dataSource, {
    indexMap: {
      x: Array.from({ length: dataSource.length }, (_, index) => index),
      y: columns.map((v: any) => v.dataIndex)
    }
  })

  const spanMethod = ({ rowIndex, columnIndex }: any) => {
    const { rowSpan, colSpan } = matrix.getItem(rowIndex, columnIndex)
    return { rowspan: rowSpan, colspan: colSpan }
  }

  const list: any = []
  matrix.forEach((v, _, realIndex) => {
    const [index, key] = realIndex
    if (!list[index]) {
      list[index] = {}
    }
    list[index][key] = v.value
  })

  return {
    spanMethod,
    dataSource: list
  }
}
