import Mock from "mockjs"
const Random = Mock.Random

export const getData = (total: number = 10) => {
  const data = []
  for (var i = 0; i < total; i++) {
    let obj = {
      id: Random.uuid(),
      name: Random.cname(),
      sex: Random.integer(0, 1),
      age: Random.integer(18, 50),
      city: Random.city(),
      region: Random.region(),
      email: Random.email()
    }
    data.push(obj)
  }
  return data
}
