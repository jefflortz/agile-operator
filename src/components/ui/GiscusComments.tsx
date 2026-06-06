'use client'

import { useEffect, useRef } from 'react'

// Configuration — fill these in at https://giscus.app
// 1. Enable Discussions on your GitHub repo
// 2. Install the Giscus GitHub App: https://github.com/apps/giscus
// 3. Visit https://giscus.app, enter your repo, copy the values below

const GISCUS_REPO = 'jefflortz/agile-operator'
const GISCUS_REPO_ID = 'R_kgDOSwg_Ew'
const GISCUS_CATEGORY = 'Announcements'
const GISCUS_CATEGORY_ID = 'DIC_kwDOSwg_E84C-oyC'

export default function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return


    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_REPO)
    script.setAttribute('data-repo-id', GISCUS_REPO_ID)
    script.setAttribute('data-category', GISCUS_CATEGORY)
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true

    ref.current.appendChild(script)
  }, [])

  return (
    <div className="mt-16 pt-10 border-t border-navy-100">
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-6">
        Discussion
      </p>
      <div ref={ref} />
    </div>
  )
}
