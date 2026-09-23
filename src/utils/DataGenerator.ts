export const DataGenerator = {
  uniqueEmail(prefix = 'test'): string {
    return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10_000)}@example.com`;
  },

  uniqueUsername(prefix = 'user'): string {
    return `${prefix}_${Date.now()}`;
  },

  randomString(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let out = '';
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  },

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomIndianPhoneNumber(): string {
    const startDigits = ['6', '7', '8', '9'];
    const first = startDigits[Math.floor(Math.random() * startDigits.length)];
    let rest = '';
    for (let i = 0; i < 9; i++) {
      rest += Math.floor(Math.random() * 10);
    }
    return `${first}${rest}`;
  },
};
