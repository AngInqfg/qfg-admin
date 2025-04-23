import Dayjs from 'dayjs'
export function rgbaToHex(rgba: any) {
    const rgbaValues = rgba.match(/\d+(\.\d+)?/g).map(Number);
    const r = rgbaValues[0];
    const g = rgbaValues[1];
    const b = rgbaValues[2];
    const a = rgbaValues[3];
    const hexR = r.toString(16).padStart(2, '0');
    const hexG = g.toString(16).padStart(2, '0');
    const hexB = b.toString(16).padStart(2, '0');
    const hexA = Math.round(a * 255).toString(16).padStart(2, '0');
    return `#${hexR}${hexG}${hexB}${hexA}`;
}
export function fileToBase64(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e: any) {
            resolve(e.target.result.split(',')[1])
        };
    })
}
export const forMat = (time: any, format = "YYYY-MM-DD") => {
    let t = new RegExp(/^\d+$/).test(time) ? Number(time) : time
    const val = Dayjs(t).format(format)
    return val
}
export const getDiffYear = (time: any) => {
    const val = Dayjs().diff(Dayjs(time), 'minute', true)
    const totalDays = Math.floor(val / (24 * 60)); // 转换为天数
    const years = Math.floor(totalDays / 365); // 计算年数
    const remainingDays = totalDays % 365; // 剩余的天数
    const months = Math.floor(remainingDays / 30); // 计算月数
    const days = remainingDays % 30; // 剩余天数
    return { y: years, m: months, d: days }
}