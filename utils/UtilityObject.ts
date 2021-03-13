export class UtilityObject extends Object {
  /**
   * Check object a has all of keys of object b
   *
   * @param a
   * @param b
   */
  static hasAllKeys (a: object, b: object): boolean {
    const keysA = this.keys(a)
    const keysB = this.keys(b)
    return keysB.every(el => keysA.includes(el))
  }
}
