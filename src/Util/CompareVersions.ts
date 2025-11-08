export function compareVersions(v1: number[], v2: number[]): number {
    let result = 0;
    const l1 = v1.length;
    const l2 = v2.length;
    let i = 0;
    if (l1 <= l2) {
        while (result === 0 && i < l2) {
            result = (i < l1 ? v1[i] : 0) - v2[i];
            i++;
        }
    }
    else {
        while (result === 0 && i < l1) {
            result = v1[i] - (i < l2 ? v2[i] : 0);
            i++;
        }
    }
    return result;
}