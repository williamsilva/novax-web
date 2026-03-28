export class KeyValueModel<T> {
  private data: { [key: string]: T } = {};

  constructor(initialValues: { [key: string]: T }) {
    this.data = initialValues;
  }

  setValue(key: string, value: T): void {
    this.data[key] = value;
  }

  getValue(key: string): T | undefined {
    return this.data[key];
  }

  getKeyByValue(value: T): string {
    const keys = Object.keys(this.data);
    for (const key of keys) {
      if (this.data[key] === value) {
        return key;
      }
    }
    return 'NULL';
  }

  getAllValues(): { [key: string]: T } {
    return this.data;
  }
}
