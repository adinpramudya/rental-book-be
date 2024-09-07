export class ConvertTextToUpperCase {
  static toUpperCaseWithUnderscore(value: string): string {
    return value.toUpperCase().split(' ').join('_');
  }
}
