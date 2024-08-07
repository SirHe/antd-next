import getMergeList from "../core"
import Matrix from "../core/matrix"
import { isArray, suffixToPrefix } from "../core/utils"

interface MergeItem {
  s: { r: number; c: number }
  e: { r: number; c: number }
}

export default function (data: Array<object>, columns: Array<any>) {
  data = getMergeList(
    data,
    columns.map((v: any) => ({ dataIndex: v.dataIndex, isMerge: v.isMerge }))
  )
  data = suffixToPrefix(data)
  const header = columns.map((v: any) => v.title)
  const body: Array<Array<any>> = []
  let merges: Array<MergeItem> = []
  const yIndexMap = columns.map((item) => item.dataIndex)
  const matrix = new Matrix(data, { indexMap: { y: yIndexMap } })
  matrix.forEach((v: any, [i, j]) => {
    if (!isArray(body[i])) {
      body[i] = []
    }
    body[i][j] = v.value
    if (v.rowSpan > 1) {
      // 需要合并的行
      merges.push({ s: { r: i, c: j }, e: { r: i + (v.rowSpan - 1), c: j } })
    }
    if (v.rowSpan === 0) {
      body[i][j] = ""
    }
  })

  // 由于表头的缘故，需要整体下移一格
  merges = merges.map((v) => {
    return {
      s: { ...v.s, r: v.s.r + 1 },
      e: { ...v.e, r: v.e.r + 1 }
    }
  })

  return {
    data: [header, ...body],
    merges
  }
}
