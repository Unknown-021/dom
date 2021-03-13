export function GetGeolocation (): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!coords.latitude || !coords.longitude) {
          return reject(new Error('No coords found'))
        }
        resolve(coords)
      },
      reject
    )
  })
}
