export interface UrlEntry {
  name: string
  url: string
}

export interface CheckResult {
  entry: UrlEntry
  status: number | null
  latencyMs: number
  ok: boolean
  error?: string
}
