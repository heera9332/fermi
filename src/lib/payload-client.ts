import configPromise from '@payload-config'
import { getPayload } from 'payload'
const payload = await getPayload({ config: configPromise })

export default payload
