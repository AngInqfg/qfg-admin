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