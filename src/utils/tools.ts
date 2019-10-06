export const transformDate = (time: number): string => {
  let res = '';
  let t = (new Date().getTime() - Number(time)) / 1000;
  t = parseInt(t.toString(), 10);
  const day = Math.floor(t / (60 * 60 * 24));
  const hour = Math.floor(t / (60 * 60));
  const minute = Math.floor(t / 60);
  if (day > 0) return day + '天前';
  if (hour > 0) return hour + '小时前';
  if (minute > 0) return minute + '分钟前';
  return '刚刚';
};

// 日期格式化
export const dateFormat = (date: Date, format: string): string => {
  const args: any = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let i in args) {
    const n = args[i];
    if (new RegExp('(' + i + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? n : ('00' + n).substr(('' + n).length));
    }
  }
  return format;
};

export const base64Trans: string = 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==';
