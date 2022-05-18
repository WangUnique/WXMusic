// 创建一个正则来匹配歌词字符串
//  \d{2}  两位数字
const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
const lyricInfos = []
export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split("\n")

  for (const lineString of lyricStrings) {
    
    const timeResult = timePattern.exec(lineString)
    if(!timeResult) continue
    // ["[04:42.119]", "04", "42", "119" ...]
    // console.log(timeResult);
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3]
    // 因为如果第三位毫秒尾数是0的话会被自动省略
    // 也就是 65ms 其实是 650ms 所以要进行一个判断
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10: millsecondTime * 1
    const time = minute + second + millsecond

    // 获取歌词文本
    // const lyricText = lineString.replace(timeResult[0], '')
    const text = lineString.replace(timePattern, '')
    lyricInfos.push({time, text}) 
  }

  return lyricInfos
}