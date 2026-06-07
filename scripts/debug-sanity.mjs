import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
  for (const rawLine of envFile.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const val = line.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && val) process.env[key] = val
  }
  console.log('✓ Loaded .env.local')
} catch (e) {
  console.error('✗ Could not load .env.local:', e.message)
}

const token = process.env.SANITY_API_TOKEN
console.log('Token loaded:', token ? `yes (${token.slice(0, 10)}...)` : 'NO TOKEN')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

console.log('Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x')
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production')

// 1. Test read
console.log('\n--- Testing READ ---')
try {
  const count = await client.fetch('count(*[_type == "playbookContent"])')
  console.log(`✓ Found ${count} playbookContent documents`)
} catch (e) {
  console.error('✗ Read failed:', e.message)
}

// 2. Test write on first doc
console.log('\n--- Testing WRITE ---')
try {
  const doc = await client.fetch('*[_type == "playbookContent"][0]{ _id, title, seo }')
  if (!doc) { console.error('✗ No documents found'); process.exit(1) }
  console.log(`Attempting patch on: "${doc.title}" (${doc._id})`)
  console.log('Current seo.seoTitle:', doc.seo?.seoTitle ?? '(empty)')

  await client.patch(doc._id).set({ 'seo.seoTitle': 'Debug Test Title | Agile Operator' }).commit()
  console.log('✓ Write succeeded')

  // Read back to confirm
  const updated = await client.fetch('*[_type == "playbookContent" && _id == $id][0]{ seo }', { id: doc._id })
  console.log('Confirmed seo.seoTitle:', updated.seo?.seoTitle)
} catch (e) {
  console.error('✗ Write failed:', e.message)
  if (e.statusCode) console.error('  Status:', e.statusCode)
  if (e.response?.body) console.error('  Body:', JSON.stringify(e.response.body).slice(0, 300))
}
