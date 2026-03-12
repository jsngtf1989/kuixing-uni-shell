const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

const LUNAR_MONTH_NAME = [
  '', '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月',
]

const LUNAR_DAY_NAME = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
]

// Each entry encodes one lunar year (1900–2100).
// Bits 0-3 : leap month number (0 = none)
// Bits 4-15: months 1-12 day-count flags (bit 15 = month 1); 1 = 30 days, 0 = 29 days
// Bit 16   : leap month day-count (1 = 30 days, 0 = 29 days)
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
]

// Lunar new year Gregorian dates (month << 5 | day) for 1900-2100
const SPRING_FESTIVAL = [
  0x23f, 0x239, 0x228, 0x238, 0x226, 0x235, 0x224, 0x233, 0x222, 0x232, // 1900
  0x220, 0x230, 0x238, 0x227, 0x237, 0x225, 0x234, 0x223, 0x233, 0x221, // 1910
  0x230, 0x228, 0x237, 0x225, 0x235, 0x224, 0x233, 0x222, 0x232, 0x221, // 1920
  0x230, 0x237, 0x226, 0x236, 0x224, 0x234, 0x224, 0x231, 0x231, 0x220, // 1930
  0x228, 0x227, 0x235, 0x225, 0x234, 0x223, 0x232, 0x222, 0x229, 0x229, // 1940
  0x237, 0x226, 0x235, 0x224, 0x233, 0x224, 0x232, 0x231, 0x238, 0x228, // 1950
  0x237, 0x225, 0x235, 0x225, 0x233, 0x221, 0x231, 0x229, 0x230, 0x237, // 1960
  0x226, 0x235, 0x223, 0x233, 0x223, 0x231, 0x231, 0x238, 0x227, 0x237, // 1970
  0x236, 0x225, 0x225, 0x233, 0x222, 0x230, 0x229, 0x229, 0x237, 0x226, // 1980
  0x227, 0x235, 0x224, 0x223, 0x232, 0x231, 0x239, 0x228, 0x228, 0x236, // 1990
  0x225, 0x224, 0x232, 0x221, 0x222, 0x229, 0x229, 0x238, 0x226, 0x226, // 2000
  0x234, 0x223, 0x221, 0x222, 0x229, 0x229, 0x238, 0x238, 0x227, 0x226, // 2010
  0x234, 0x223, 0x222, 0x231, 0x231, 0x228, 0x228, 0x237, 0x225, 0x225, // 2020
  0x223, 0x223, 0x231, 0x230, 0x229, 0x227, 0x236, 0x226, 0x234, 0x224, // 2030
  0x232, 0x221, 0x221, 0x229, 0x228, 0x236, 0x226, 0x235, 0x233, 0x223, // 2040
  0x221, 0x221, 0x229, 0x228, 0x236, 0x236, 0x224, 0x234, 0x222, 0x222, // 2050
  0x230, 0x228, 0x237, 0x236, 0x225, 0x233, 0x223, 0x222, 0x231, 0x228, // 2060
  0x237, 0x226, 0x225, 0x234, 0x223, 0x232, 0x231, 0x220, 0x228, 0x237, // 2070
  0x226, 0x236, 0x224, 0x233, 0x222, 0x232, 0x221, 0x229, 0x228, 0x237, // 2080
  0x226, 0x235, 0x224, 0x233, 0x223, 0x231, 0x230, 0x229, 0x227, 0x236, // 2090
  0x226, // 2100
]

function leapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf
}

function leapDays(year) {
  if (!leapMonth(year)) return 0
  return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29
}

function monthDays(year, month) {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

function yearDays(year) {
  let total = 0
  for (let m = 1; m <= 12; m++) {
    total += monthDays(year, m)
  }
  return total + leapDays(year)
}

/**
 * Convert a Gregorian date to a lunar date object.
 * Returns { lunarYear, lunarMonth, lunarDay, isLeap, monthName, dayName }
 */
export function solarToLunar(year, month, day) {
  if (year < 1901 || year > 2099) return null

  // Use UTC to avoid historical timezone offset discrepancies (e.g. pre-1949 China)
  const baseMs = Date.UTC(1900, 0, 31) // 1900-01-31 = Lunar 1900/1/1
  const targetMs = Date.UTC(year, month - 1, day)
  let offset = Math.round((targetMs - baseMs) / 86400000)

  if (offset < 0) return null

  let lunarYear = 1900
  let daysInYear
  while (lunarYear < 2101 && offset > 0) {
    daysInYear = yearDays(lunarYear)
    if (offset < daysInYear) break
    offset -= daysInYear
    lunarYear++
  }

  if (lunarYear > 2100) return null

  const leap = leapMonth(lunarYear)
  let isLeap = false
  let lunarMonth = 1
  let daysInMonth

  for (let m = 1; m <= 12; m++) {
    if (leap && m === leap + 1 && !isLeap) {
      daysInMonth = leapDays(lunarYear)
      isLeap = true
      m-- // re-check this month index after processing leap
    } else {
      daysInMonth = monthDays(lunarYear, m)
      isLeap = false
    }

    if (offset < daysInMonth) {
      lunarMonth = m
      break
    }
    offset -= daysInMonth
    lunarMonth = m
  }

  const lunarDay = offset + 1

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeap,
    monthName: (isLeap ? '闰' : '') + LUNAR_MONTH_NAME[lunarMonth],
    dayName: LUNAR_DAY_NAME[lunarDay] || `${lunarDay}`,
    yearGanZhi: getYearGanZhi(lunarYear),
    shengXiao: SHENG_XIAO[(lunarYear - 4) % 12],
  }
}

function getYearGanZhi(lunarYear) {
  const ganIdx = (lunarYear - 4) % 10
  const zhiIdx = (lunarYear - 4) % 12
  return TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx]
}

/**
 * Get the 天干地支 (sexagenary cycle) for a given Gregorian date.
 * Reference: 2000-01-07 = 甲子日 (cycle index 0)
 */
export function getDayGanZhi(year, month, day) {
  const refMs = Date.UTC(2000, 0, 7)
  const targetMs = Date.UTC(year, month - 1, day)
  const diff = Math.round((targetMs - refMs) / 86400000)
  const idx = ((diff % 60) + 60) % 60
  return TIAN_GAN[idx % 10] + DI_ZHI[idx % 12]
}

/**
 * Build a full month calendar data for the UI.
 * Returns an array of week-rows, each containing 7 day-cells.
 */
export function buildMonthCalendar(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startWeekday = firstDay.getDay() // 0=Sunday

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  const cells = []

  // Fill leading blanks
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = solarToLunar(year, month, d)
    const ganZhi = getDayGanZhi(year, month, d)
    const dateStr = `${year}-${month}-${d}`
    cells.push({
      day: d,
      lunarDay: lunar ? lunar.dayName : '',
      lunarMonth: lunar ? lunar.monthName : '',
      ganZhi,
      isToday: dateStr === todayStr,
      isFirstOfLunarMonth: lunar && lunar.lunarDay === 1,
    })
  }

  // Fill trailing blanks to complete last week
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return weeks
}

/**
 * Get lunar info summary for the header area of the calendar.
 */
export function getLunarMonthInfo(year, month) {
  const midDay = Math.min(15, new Date(year, month, 0).getDate())
  const lunar = solarToLunar(year, month, midDay)
  if (!lunar) return null
  return {
    lunarYear: lunar.lunarYear,
    yearGanZhi: lunar.yearGanZhi,
    shengXiao: lunar.shengXiao,
  }
}

export { TIAN_GAN, DI_ZHI, SHENG_XIAO, LUNAR_MONTH_NAME, LUNAR_DAY_NAME }
