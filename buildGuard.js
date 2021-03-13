if (!process.env.NUXT_ENV_BACKEND_API_ROOT_URL) {
  throw new Error('No backend URL at .env')
}

if (!process.env.NUXT_ENV_CMS_URL) {
  throw new Error('No CMS URL at .env')
}

try {
  // eslint-disable-next-line
  const tryURL = new URL('/', process.env.NUXT_ENV_BACKEND_API_ROOT_URL)
} catch (e) {
  throw new Error('Backend URL is not valid at .env')
}

try {
  // eslint-disable-next-line
  const tryURL = new URL('/', process.env.NUXT_ENV_CMS_URL)
} catch (e) {
  throw new Error('CMS URL is not valid at .env')
}

if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_TAG_MANAGER_ID) {
  throw new Error('No Google tag ID at .env')
}
