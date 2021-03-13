export class StringHelper {
  static upperEveryWord (string: string, delimeter = ' ') {
    return string.split(delimeter).map((word) => {
      return `${word[0].toLocaleUpperCase()}${word.substr(1)}`
    }).join(delimeter)
  }
}
