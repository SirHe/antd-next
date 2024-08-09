import Matrix, { FOREACH_MODE } from "./matrix"

export const get = (obj: object, key: string | symbol) => {
  return (obj as any)?.[key]
}

export const chunk = (arr: Array<any>, size = arr.length) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export const isArray = Array.isArray
export const isObject = (v: any) => v !== null && typeof v === "object"
export const isUndefined = (v: any) => v === void 0

export const suffixToPrefix = (list: Array<object>) => {
  const matrix = new Matrix(list)
  matrix.forEach((value, [i, j]) => {
    if (value.rowSpan > 1) {
      // 需要合并的行
      const rowSpan = value.rowSpan
      const item = matrix.getItem(i - (rowSpan - 1), j)
      value.rowSpan = 0
      matrix.setItem(i, j, value)
      item.rowSpan = rowSpan
      matrix.setItem(i - (rowSpan - 1), j, item)
    }
  }, FOREACH_MODE.COLUMN)

  return matrix.getData()
}
export const prefixToSuffix = () => {}
