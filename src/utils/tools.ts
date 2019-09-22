export const transformDate = (time: number): string => {
  let res = '';
  let t = (new Date().getTime() - Number(time) * 1000) / 1000;
  t = parseInt(t.toString(), 10);
  const day = Math.floor(t / (60 * 60 * 24));
  const hour = Math.floor(t / (60 * 60));
  const minute = Math.floor(t / 60);
  if (day > 0) return day + '天前';
  if (hour > 0) return hour + '小时前';
  if (minute > 0) return minute + '分钟前';
  return '刚刚';
};
