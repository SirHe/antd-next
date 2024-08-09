import { isObject } from "./utils"

interface IndexMap {
  x?: Array<string>
  y?: Array<string>
}

// 遍历方式：行优先或者列优先
export const FOREACH_MODE = {
  ROW: 1,
  COLUMN: 2
}
/**
 * 虚拟二维数组
 *
 * 我们知道一般的表格都可以使用二维坐标来表示（行列），但是我们知道表格的数据一般是一个对象数组（[{..}, {...}, {...}, ...]）。
 * 所以我们希望封装一个 util，实现我们可以使用行列坐标来访问表格数据。除此之外，我们的方法更加通用，支持以下这两种类型：
 * 1. 对象数组：[{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}, ...]
 * 2. 二维对象：{ x: {a: 1, b: 2}, y: {a: 3, b: 4}, z: {a: 5, b: 6}, ...}
 */
export default class Matrix {
  public data: any = []
  public x: Array<string> = []
  public y: Array<string> = []
  public indexMap: IndexMap = {}
  constructor(data: any, options = {}) {
    if (data instanceof Matrix) {
      return data
    }
    this.data = data
    this.indexMap = (options as any).indexMap
    const { x, y } = this.init()
    this.x = x
    this.y = y
  }

  init() {
    const { data, indexMap: { x: xIndex = [], y: yIndex = [] } = {} } = this
    if (!isObject(data)) {
      throw new Error("传入数据不符合要求")
    }
    const hasObject = Object.values(data).some((v) => isObject(v))
    if (!hasObject) {
      throw new Error("传入数据不符合要求")
    }

    let x = Object.keys(data)
    const values: any = Object.values(data).reduce((pre: any, v: any) => ({ ...pre, ...v }), {})
    let y = Object.keys(values)

    // 如果配置了xIndex、yIndex的顺序，那么就调整其顺序
    // 设计这一层的目的主要是因为keys的结果是无序的，所以对于对象的情况我们有时候遍历时对于属性有顺序控制的需求
    if (xIndex.length) {
      // 这样就可以支持部分有序，部分无序的情况
      x = [...xIndex, ...x.filter((v) => !xIndex.includes(v))]
    }
    if (yIndex.length) {
      y = [...yIndex, ...y.filter((v) => !yIndex.includes(v))]
    }
    return { x, y }
  }

  get length() {
    return [this.x.length, this.y.length]
  }

  getData() {
    return this.data
  }

  // 将虚拟游标转化成真实游标
  getXKey(i: number) {
    return this.x[i]
  }
  getYKey(j: number) {
    return this.y[j]
  }

  // 这里有两种情况，可能传入的是虚拟游标（index），也可能传入的是真实游标
  // 对于数组虚拟游标就是真实游标；而对于对象，虚拟游标是index，真实游标是key
  getItem(_i: string | number, _j: string | number) {
    // 如果转成number变成了NaN，那么说明传入的是真实游标；否则需要将虚拟游标转化成真实游标
    const i = Number.isNaN(Number(_i)) ? _i : this.x[Number(_i)]
    const j = Number.isNaN(Number(_j)) ? _j : this.y[Number(_j)]
    return this.data[i]?.[j]
  }

  setItem(_i: string | number, _j: string | number, value: any) {
    const i = Number.isNaN(Number(_i)) ? _i : this.x[Number(_i)]
    const j = Number.isNaN(Number(_j)) ? _j : this.y[Number(_j)]
    const inner = this.data[i]

    // 因为前面为了兼容forEach，允许了第二层不是对象的数据传进来运行；所以这里赋值可能会报错
    if (isObject(inner)) {
      inner[j] = value
    }
  }

  forEach(
    fn: (item: any, index: Array<number>, realIndex: Array<number | string>, data: any) => void,
    mode = FOREACH_MODE.ROW
  ) {
    const { x, y, data } = this
    const xLen = x.length
    const yLen = y.length
    const iLen = mode === FOREACH_MODE.ROW ? xLen : yLen
    const jLen = mode === FOREACH_MODE.ROW ? yLen : xLen
    // ROW：先遍历完第一行再遍历第二行，以此类推
    // COLUMN：先遍历第一列，再遍历第二列，以此类推
    for (let _i = 0; _i < iLen; _i++) {
      for (let _j = 0; _j < jLen; _j++) {
        let item
        if (mode === FOREACH_MODE.ROW) {
          item = this.getItem(_i, _j)
        } else {
          item = this.getItem(_j, _i)
        }
        const index = mode === FOREACH_MODE.ROW ? [_i, _j] : [_j, _i]
        const realIndex = mode === FOREACH_MODE.ROW ? [x[_i], y[_j]] : [y[_j], x[_i]]
        fn(item, index, realIndex, data)
      }
    }
  }
}
