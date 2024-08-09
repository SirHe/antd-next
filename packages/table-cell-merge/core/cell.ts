// 主要是固定每个单元格的数据结构
export default class Cell {
  public value: any
  public rowSpan?: number
  public colSpan?: number
  constructor(value: any, rowSpan: number = 1, colSpan: number = 1) {
    if (value instanceof Cell) {
      return new Cell(value.value, value.rowSpan, value.colSpan)
    }
    this.value = value
    this.rowSpan = rowSpan
    this.colSpan = colSpan
  }
}
