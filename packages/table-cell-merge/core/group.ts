import { isArray } from "./utils"
import Matrix, { FOREACH_MODE } from "./matrix"
import { ColumnItem } from "./type"

/**
 * 对一个对象数组使用动态规划进行快速的分组
 * 该算法的核心就是找到当前这一列在分组后的index，有了这个信息后，我们最后只需要将这一列移动到对应的index，便可完成分组
 * 所以这里有两个很重要的概念：原始游标、分组游标
 * @param {Array} list
 */
export default (list: Array<object>, columns: Array<ColumnItem> = []) => {
  if (!isArray(list)) {
    throw new Error("list must be an array")
  }
  // 由于我们做的就是合并功能，所以我们默认进行合并，只有配置false才不合并
  const yIndexMap = columns.filter((item) => !(item.isMerge === false)).map((item) => item.dataIndex)
  const matrix = new Matrix(list, { indexMap: { y: yIndexMap } })
  const [xLen, yLen] = matrix.length
  const dp = Array.from(Array(xLen), () => Array(yLen))
  const colValueCountMap = new Map()

  /**
   * 这里就是 group 算法的核心，该算法的核心思想是这样的（其实就是分配序号法）：
   * 举个例子：[[1, 2, 3], [1, 1, 4], [2, 1, 2]]
   * 第一列排序的结果是：[0, 0, 2]，这个结果表示 [2, 1, 2] 这条数据的起点是 2。
   * 第二列排序的结果是：[0, 1, 2]，当 [1, 2, 3] 中的 2 与 [1, 1, 4] 中的 1 进行比较时，发现两者不一样，此时 1 的序号还需要参考前面的 1，也就是 0 + 1。
   * 依次类推，等到最后一列排序结果被计算出来时，那么合并情况下的序号就基本上确定了（当然，需要注意处理重复的情况）。
   */
  matrix.forEach((value, [i, j]) => {
    // 先考虑边界
    if (j === 0) {
      if (!colValueCountMap.has(value)) {
        colValueCountMap.set(value, 0)
      }
      colValueCountMap.set(value, colValueCountMap.get(value) + 1)

      // 第一列遍历到了末尾（取出之前的index，加上数量信息）
      if (i === xLen - 1) {
        let count = 0
        const groupIndexMap = new Map()

        ;[...colValueCountMap.entries()].forEach(([value, _count]) => {
          const key = value
          if (!groupIndexMap.has(key)) {
            groupIndexMap.set(key, count)
            count += _count
          }
        })

        for (let _i = 0; _i < xLen; _i++) {
          const key = matrix.getItem(_i, j)
          dp[_i][j] = groupIndexMap.get(key)
        }

        // 清除中间变量
        colValueCountMap.clear()
      }
    } else {
      // 以前一列的key作为基础（这里面的虚拟index也具有key的作用）
      const preIndex = dp[i][j - 1]
      if (!colValueCountMap.has(preIndex)) {
        colValueCountMap.set(preIndex, new Map())
      }
      const innerGroupCountMap = colValueCountMap.get(preIndex)
      if (!innerGroupCountMap.has(value)) {
        innerGroupCountMap.set(value, 0)
      }
      innerGroupCountMap.set(value, innerGroupCountMap.get(value) + 1)

      // 遍历到了末尾
      if (i === xLen - 1) {
        const groupIndexMap = new Map()
        // 将count累积起来
        ;[...colValueCountMap.entries()].forEach(([preIndex, innerMap]) => {
          if (!groupIndexMap.has(preIndex)) {
            groupIndexMap.set(preIndex, {
              map: new Map(),
              count: 0
            })
          }
          ;[...innerMap.entries()].forEach(([item, count]) => {
            const { map, count: _count } = groupIndexMap.get(preIndex)
            if (!map.has(item)) {
              map.set(item, _count)
              groupIndexMap.set(preIndex, { map, count: _count + count })
            }
          })
        })

        for (let _i = 0; _i < xLen; _i++) {
          const preIndex = dp[_i][j - 1]
          const item = matrix.getItem(_i, j)
          dp[_i][j] = preIndex + groupIndexMap.get(preIndex).map.get(item)
        }

        // 清除中间变量
        colValueCountMap.clear()
      }
    }
  }, FOREACH_MODE.COLUMN)

  // 根据分组index调整顺序
  const result: any = isArray(list) ? [] : {}
  const indexSet = new Set()
  for (let i = 0; i < xLen; i++) {
    const item = list[i]
    let index = dp[i][yLen - 1]

    // 直到找到一个不存在，解决冲突
    while (indexSet.has(index)) {
      index++
    }

    indexSet.add(index)
    result[index] = item
  }

  return result
}
