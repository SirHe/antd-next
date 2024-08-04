import getMergeList from "../core"
import { suffixToPrefix } from "../core/utils"

/**
 *  这一块内容与table进行一个强绑定，负责将合并信息渲染到table视图上
 */
export default (dataSource: Array<object>, columns: Array<any>) => {
  dataSource = getMergeList(
    dataSource,
    columns.map((v: any) => ({ dataIndex: v.dataIndex, isMerge: v.isMerge }))
  )
  dataSource = suffixToPrefix(dataSource)

  // 解析渲染合并信息
  columns = columns.map((v: any) => {
    return {
      ...v,
      render(text: any, record: any, index: number) {
        let { value, rowSpan, colSpan } = text || {}
        const children = v.render?.(value, record, index) || value
        return {
          children,
          props: { rowSpan, colSpan }
        }
      }
    }
  }) as any

  return {
    columns,
    dataSource
  }
}
