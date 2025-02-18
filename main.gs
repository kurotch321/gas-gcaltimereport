const calendarId =
  PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
const calendarApi = CalendarApp.getCalendarById(calendarId);

function run() {
  const year = 2025;
  const month = 2;

  main(year, month)
}

function main(year, month) {
  if (!year || !month) {
    throw Error("year and month are required");
  }

  // 対象期間のイベントを取得
  const events = getAllEvents(year, month);

  // イベントの時間を計算
  const eventDurations = events.map((event) => getEventDuration(event));
  const totalDuration = eventDurations.reduce((acc, cur) => acc + cur, 0);

  // 結果をログに出力
  const message = `${year}年${month}月の稼働時間は${totalDuration}分(${(
    totalDuration / 60
  ).toFixed(2)}時間)です`;
  Logger.log(message);
}

function getAllEvents(year, month) {
  // 月初から月末までのイベントを取得
  const startDate = new Date(year, month - 1, 1); // 月は0-indexed
  const endDate = new Date(year, month, 1); // 翌月1日
  const events = calendarApi.getEvents(startDate, endDate); // responseにendDateは含まれない

  // 終日のイベントを除外
  const filteredEvents = events.filter((event) => !event.isAllDayEvent());

  return filteredEvents;
}

function getEventDuration(event) {
  // 開始時間と終了時間を取得
  const startTime = event.getStartTime();
  const endTime = event.getEndTime();

  // 分単位で返す
  return (endTime - startTime) / (1000 * 60);
}
