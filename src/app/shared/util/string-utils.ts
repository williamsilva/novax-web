export class StringUtils {
  public static isNullOrEmpty(val: string): boolean {
    if (val === undefined || val === null || val.trim() === '') {
      return true;
    }
    return false;
  }

  public static onlyNumbers(numbers: string): string {
    return numbers.replace(/[^0-9]/g, '');
  }
}
