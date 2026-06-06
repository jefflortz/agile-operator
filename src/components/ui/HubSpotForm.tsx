'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: Record<string, unknown>) => void
      }
    }
  }
}

type HubSpotFormProps = {
  portalId: string
  formId: string
  region?: string
}

export default function HubSpotForm({
  portalId,
  formId,
  region = 'na1',
}: HubSpotFormProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!portalId || !formId || initialized.current) return
    initialized.current = true

    const createForm = () => {
      if (!containerRef.current || !window.hbspt) return
      // Clear any prior render (e.g. Strict Mode double-invoke)
      containerRef.current.innerHTML = ''
      window.hbspt.forms.create({
        region,
        portalId,
        formId,
        target: `#hs-form-target`,
      })
    }

    if (window.hbspt) {
      createForm()
      return
    }

    const script = document.createElement('script')
    script.src = '//js.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.onload = createForm
    document.head.appendChild(script)
  }, [portalId, formId, region])

  return (
    <div
      id="hs-form-target"
      ref={containerRef}
      className="[&_.hs-form]:space-y-4
        [&_.hs-form_label]:block [&_.hs-form_label]:font-sans [&_.hs-form_label]:text-sm [&_.hs-form_label]:font-medium [&_.hs-form_label]:text-navy-700 [&_.hs-form_label]:mb-1
        [&_.hs-form_input]:w-full [&_.hs-form_input]:rounded [&_.hs-form_input]:border [&_.hs-form_input]:border-navy-200 [&_.hs-form_input]:px-4 [&_.hs-form_input]:py-2.5 [&_.hs-form_input]:text-sm [&_.hs-form_input]:text-navy-900 [&_.hs-form_input]:outline-none [&_.hs-form_input:focus]:border-navy-900 [&_.hs-form_input:focus]:ring-1 [&_.hs-form_input:focus]:ring-navy-900
        [&_.hs-form_textarea]:w-full [&_.hs-form_textarea]:rounded [&_.hs-form_textarea]:border [&_.hs-form_textarea]:border-navy-200 [&_.hs-form_textarea]:px-4 [&_.hs-form_textarea]:py-2.5 [&_.hs-form_textarea]:text-sm [&_.hs-form_textarea]:text-navy-900 [&_.hs-form_textarea]:outline-none [&_.hs-form_textarea:focus]:border-navy-900 [&_.hs-form_textarea:focus]:ring-1 [&_.hs-form_textarea:focus]:ring-navy-900
        [&_.hs-form_select]:w-full [&_.hs-form_select]:rounded [&_.hs-form_select]:border [&_.hs-form_select]:border-navy-200 [&_.hs-form_select]:px-4 [&_.hs-form_select]:py-2.5 [&_.hs-form_select]:text-sm [&_.hs-form_select]:text-navy-900
        [&_.hs-button]:mt-2 [&_.hs-button]:inline-flex [&_.hs-button]:items-center [&_.hs-button]:justify-center [&_.hs-button]:rounded [&_.hs-button]:bg-navy-900 [&_.hs-button]:px-8 [&_.hs-button]:py-3 [&_.hs-button]:font-sans [&_.hs-button]:text-sm [&_.hs-button]:font-medium [&_.hs-button]:text-white [&_.hs-button:hover]:bg-navy-700
        [&_.hs-error-msgs]:mt-1 [&_.hs-error-msgs_li]:font-sans [&_.hs-error-msgs_li]:text-xs [&_.hs-error-msgs_li]:text-red-600
        [&_.submitted-message]:font-sans [&_.submitted-message]:text-base [&_.submitted-message]:text-navy-700"
    />
  )
}
