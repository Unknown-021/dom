import { createModule } from 'vuex-class-component'

export class DealsLabelsStore extends createModule({
  target: 'nuxt',
  namespaced: 'dealsLabels'
}) {
  private _colors = new Map<string, string>();

  get color () {
    return (key: string): string => {
      const color = this._colors.get(key)
      if (!color) {
        const newColor = `hsl(${Math.floor(Math.random() * 360) + 1}, 70%, 50%)`
        if (process.client) {
          this._colors.set(key, newColor)
        }
        return newColor
      }
      return color
    }
  }
}
