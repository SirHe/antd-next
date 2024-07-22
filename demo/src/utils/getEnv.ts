type Recordable<T = any> = Record<string, T>

interface EnvConfig {
  VITE_PORT?: number
  VITE_OPEN?: boolean
}

export function wrapperEnv(envConfig: Recordable): EnvConfig {
  const ret: any = {}
  for (let [key, value] of Object.entries(envConfig)) {
    value = value === "true" ? true : value === "false" ? false : value
    if (key === "VITE_PORT") {
      value = Number(value)
    }
    ret[key] = value
  }
  return ret
}
