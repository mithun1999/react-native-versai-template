export const getAvatarName = (name: string) => {
  if (!name) return ''
  const [first, last] = name.split(' ')
  const lastLetter = last ? last[0] : first[1] ? first[1] : ''
  return `${first[0]}${lastLetter}`
}

export const parseQuery = (str: string) => {
  if (typeof str != 'string' || str.length == 0) return {}
  let s = str.split('&')
  let s_length = s.length
  let bit: string[],
    query: any = {},
    first: string,
    second: string
  for (let i = 0; i < s_length; i++) {
    bit = s[i].split('=')
    first = decodeURIComponent(bit[0])
    if (first.length == 0) continue
    second = decodeURIComponent(bit[1])
    if (typeof query[first] == 'undefined') query[first] = second
    else if (query[first] instanceof Array) query[first].push(second)
    else query[first] = [query[first], second]
  }
  return query
}
