export class DataGenerator {
  static randomEmail(prefix = 'qa'): string {
    return `${prefix}+${Date.now()}${this.randomInt(100, 999)}@example.com`;
  }

  static randomString(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomPhone(): string {
    return `+1${this.randomInt(2000000000, 9999999999)}`;
  }
}
