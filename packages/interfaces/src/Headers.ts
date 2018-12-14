export class Headers {
  map: Map<string, any>;

  constructor(headers?: [string, any][] ) {
    this.map = new Map(headers);
  }

  public set(name: string, value: any): void {
    this.map.set(name, value);
  }

  public get<T = any>(name: string): T {
    return this.map.get(name) as T;
  }

  public has(name: string): boolean {
    return this.map.has(name);
  }

  public delete(name: string): void {
    this.map.delete(name);
  }

  public clear(): void {
    this.map.clear();
  }

  public entries(): IterableIterator<[string, any]> {
    return this.map.entries();
  }

  public merge(headers: Headers): Headers {
    return new Headers([
      ...Array.from(this.entries()),
      ...Array.from(headers.entries())
    ]);
  }

  public toObject(): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    for (let [key, value] of this.map) {
      obj[key] = value;
    }
    return obj;
  }
}
