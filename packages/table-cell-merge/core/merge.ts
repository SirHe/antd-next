import Matrix, { FOREACH_MODE } from "./matrix"
import { ColumnItem } from "./type"
import Cell from "./cell"

// 默认使用Object.is判断两个数值是否相等,进而确定是否需要进行合并
// 不过表格中基本上都是 string 和 number 类型的数据,基本判断相等就可以了.
const isEqual = (a: any, b: any) => Object.is(a, b)

/**
 * 基本的算法思路是这样的（目前只实现行合并，如果后面有列合并的需求，稍加改造即可实现）：
 * 1、通过排序（group），可以将相同的元素紧挨在一起
 * 2、再通过从上到下，一列一列的遍历，就可以统计到相同元素的在某一列上的个数（使用累加的方式）
 * @param {Array} list
 */
export default (list: Array<object>, columns: Array<ColumnItem>, isEqualFn = isEqual) => {
  // 由于列的排列顺序不同会影响合并的结果，所以这里需要将columns信息传进来
  // isMerge 字段控制每个字段是否需要合并,默认是需要合并
  const yIndexMap = columns.filter((item) => !(item.isMerge === false)).map((item) => item.dataIndex)
  // 把我们的数据转化成二维数组
  const matrix = new Matrix(list, { indexMap: { y: yIndexMap } })
  const [xLen, yLen] = matrix.length
  const dp = Array.from(Array(xLen), () => Array(yLen)) // 用于记录相同情况

  // 动态规划，遍历填表，累积状态
  matrix.forEach((value, [i, j]) => {
    // 接收的虚拟游标
    // 状态转移方程
    const topValue = matrix.getItem(i - 1, j)
    const leftSomeSum = dp[i][j - 1] ? dp[i][j - 1] : 1
    const topSomeSum = dp[i - 1]?.[j] ? dp[i - 1][j] : 1
    // 考虑边界
    if (i === 0) {
      // 第一行
      dp[i][j] = 1
      return
    } else if (j === 0 && isEqualFn(topValue, value)) {
      // 第一列
      dp[i][j] = topSomeSum + 1
      return
    }

    // 一般情况
    if (isEqualFn(topValue, value) && leftSomeSum >= topSomeSum + 1) {
      dp[i][j] = topSomeSum + 1
    } else {
      dp[i][j] = 1
    }
  })

  // 整理someMatrix
  const someMatrix = new Matrix(dp)
  someMatrix.forEach((value, [i, j]) => {
    if (value > 1) {
      // 需要将上一项合并
      someMatrix.setItem(i - 1, j, 0)
    }
  }, FOREACH_MODE.COLUMN)

  // 把合并之后的结果生成我们的合并数据
  someMatrix.forEach((value, [i, j]) => {
    const rowSpan = value
    const colSpan = 1
    // 使用我们这种带有合并信息的数据去包装原数据
    const cell = new Cell(matrix.getItem(i, j), rowSpan, colSpan)
    matrix.setItem(i, j, cell)
  })

  return matrix.getData()
}
