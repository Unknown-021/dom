export class MapCache<K extends keyof any, V> extends Map<K, V> {
  private max = Infinity;

  private order: K[] = []

  setMaxValues (count: number) {
    if (this.max > 0) {
      this.max = count
    }
    return this
  }

  set (key: K, value: V) {
    this.order.push(key)
    this.CheckAndDeleteOverflow()
    return super.set(key, value)
  }

  private CheckAndDeleteOverflow () {
    if (this.order.length > this.max) {
      const keyToDelete = this.order.shift()
      if (keyToDelete) {
        this.delete(keyToDelete)
      }
    }
  }
}
