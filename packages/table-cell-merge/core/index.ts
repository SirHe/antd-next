import group from "./group"
import merge from "./merge"
import { ColumnItem } from "./type"
import { cloneDeep } from "lodash-es"

export default (dataSource: Array<object>, columns: Array<ColumnItem>) => {
  let list = cloneDeep(dataSource)
  list = group(list, columns)
  list = merge(list, columns)
  return list
}
