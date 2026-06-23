/**
 * seed-service-pages.mjs
 *
 * Populates Sanity with the three service pillar pages and wires each one
 * back to its corresponding Service document via the pillarPage reference.
 *
 * Usage (from the agile-operator directory):
 *   node --env-file=.env.local seed-service-pages.mjs
 *
 * Safe to re-run — uses createOrReplace with deterministic IDs so existing
 * documents are updated in place rather than duplicated.
 */

import { createClient } from '@sanity/client'

// ── Client ──────────────────────────────────────────────────────────────────

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Wrap plain text paragraphs in Portable Text block format. */
function blocks(...paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, marks: [], text }],
  }))
}

/** Wrap a single plain-text paragraph as a Portable Text answer. */
function answer(text) {
  return blocks(text)
}

// ── Page data ────────────────────────────────────────────────────────────────

const pages = [
  // ── 1. Growth Advisory ────────────────────────────────────────────────────
  {
    _id: 'pillar-growth-advisory',
    _type: 'servicePillarPage',
    serviceName: 'Growth Advisory',
    slug: { _type: 'slug', current: 'growth-advisory' },
    heroHeadline: 'Growth Strategy and Execution for Companies Under Investor Pressure',
    heroSubhead:
      'We help growth-stage companies move from reactive fire-fighting to deliberate, board-ready execution — without losing the speed that got you here.',

    introHeadline: 'What Is Growth Advisory?',
    introBody: blocks(
      'Growth advisory is not consulting in the traditional sense. We don\'t hand you a slide deck and leave. We embed alongside your leadership team to build the operating infrastructure, strategic clarity, and execution cadence your company needs to scale — and to satisfy investors who are watching closely.',
      'Most growth-stage companies hit the same inflection point: the tactics that got you to Series B or $10M ARR stop working, but you\'re not yet big enough to hire a full bench of experienced operators. Decisions pile up. Priorities blur. The board is asking questions leadership doesn\'t have clean answers to. That\'s where we come in.',
      'We bring operator-earned experience from companies that have navigated the same terrain — not frameworks borrowed from a business school, but hard-won clarity on what actually moves the needle at your stage. Engagements typically run three to six months, with a clear scope, defined milestones, and a leadership team that\'s stronger when we leave than when we arrived.',
    ),

    benefitsHeadline: 'What You Walk Away With',
    benefits: [
      { _key: 'ben1', title: 'A Clear Operating Cadence', description: 'Defined meeting rhythms, decision rights, and reporting structures that keep your team aligned without constant fire drills.' },
      { _key: 'ben2', title: 'Investor-Ready Strategy', description: 'A growth strategy that holds up in the boardroom — clear assumptions, honest risks, and credible milestones.' },
      { _key: 'ben3', title: 'Prioritized Growth Levers', description: 'We cut through the noise and identify the two or three moves that actually drive your number — and build the plan to execute them.' },
      { _key: 'ben4', title: 'Leadership Team Alignment', description: 'A leadership team that rows in the same direction, with shared language and a shared operating model.' },
      { _key: 'ben5', title: 'Execution Accountability', description: 'We don\'t just plan — we stay in the room long enough to make sure it sticks.' },
    ],

    processHeadline: 'How It Works',
    processSteps: [
      { _key: 'ps1', title: 'Diagnostic (Weeks 1–2)', description: 'We get in the weeds fast. Interviews with your leadership team, a review of your numbers, your board materials, and your current operating model. We\'re looking for the real constraint — not the one everyone\'s talking about.' },
      { _key: 'ps2', title: 'Strategic Clarity Session', description: 'A facilitated working session with your senior leadership team to align on your strategic priorities, your competitive position, and where you\'re placing your bets for the next 12–18 months.' },
      { _key: 'ps3', title: 'Operating Infrastructure Build', description: 'We design and install the operating cadences, reporting structures, and decision frameworks your company needs. This is the unglamorous work that makes everything else faster.' },
      { _key: 'ps4', title: 'Execution Support', description: 'We stay engaged through the build phase — attending key meetings, coaching your team on the hard conversations, and making sure the strategy doesn\'t dissolve under the pressure of day-to-day ops.' },
      { _key: 'ps5', title: 'Transition and Handoff', description: 'We exit with intention. Your team owns the playbook. We document what we built and leave you capable of running it without us.' },
    ],

    faqHeadline: 'Common Questions',
    faq: [
      { _key: 'faq1', question: 'How is this different from hiring a strategy consultant?', answer: answer('Traditional strategy consultants analyze and recommend. We build and execute. The deliverable isn\'t a deck — it\'s a leadership team that operates differently after we leave. We\'re selective about clients specifically because we only work with companies where we can drive real change, not just document what\'s already happening.') },
      { _key: 'faq2', question: 'What stage of company is this right for?', answer: answer('Typically Series A through Series C, or revenue-stage companies between $5M and $50M ARR navigating a growth inflection, a capital raise, or significant organizational change. If you\'re pre-product-market fit, we\'re probably not the right fit yet. If you\'re post-IPO, you likely have more infrastructure than you need.') },
      { _key: 'faq3', question: 'How long does an engagement typically last?', answer: answer('Most engagements run three to six months. Some clients extend or move into an ongoing advisory relationship. We scope each engagement to what the company actually needs — not what maximizes our hours.') },
      { _key: 'faq4', question: 'Will we work with Jeff directly?', answer: answer('Yes. Agile Operator doesn\'t staff junior consultants. You get the operator, not the associate.') },
      { _key: 'faq5', question: 'What does the time commitment look like for our team?', answer: answer('We\'re efficient with your time. Expect two to four hours per week from your CEO and key leaders during the diagnostic phase, less during execution. We design around your calendar, not ours.') },
      { _key: 'faq6', question: 'Do you work with investors directly?', answer: answer('We interface with investors as needed — board prep, investor updates, and, where helpful, direct conversations with your lead investors. We\'ve been on both sides of the table and speak both languages.') },
    ],

    ctaHeadline: 'Ready to build a company that runs like it means it?',
    ctaBody: 'Most of our best engagements start with a single honest conversation. Tell us where you\'re stuck and we\'ll tell you whether we can help.',
    ctaButtonLabel: 'Book a Strategy Session',

    seo: {
      _type: 'seoFields',
      title: 'Growth Advisory for VC-Backed Companies | Agile Operator',
      description: 'Strategic growth advisory for Series A–C companies under investor pressure. Agile Operator brings operator-earned experience to help you scale, execute, and satisfy your board.',
      keywords: ['growth advisory', 'growth strategy consulting', 'vc-backed company growth', 'series b strategy', 'fractional growth advisor'],
    },
  },

  // ── 2. Executive Coaching ─────────────────────────────────────────────────
  {
    _id: 'pillar-executive-coaching',
    _type: 'servicePillarPage',
    serviceName: 'Executive Coaching',
    slug: { _type: 'slug', current: 'executive-coaching' },
    heroHeadline: 'Executive Coaching for Leaders Navigating High-Stakes Environments',
    heroSubhead:
      'Honest, experienced counsel for executives who need more than a cheerleader — and less than a therapist.',

    introHeadline: 'What Is Executive Coaching at Agile Operator?',
    introBody: blocks(
      'Executive coaching at Agile Operator is not a wellness program. It\'s a structured, outcomes-driven partnership designed to make you a sharper, more effective leader — faster than you\'d get there on your own.',
      'We work with CEOs, C-suite executives, and senior leaders at growth-stage companies who are navigating something hard: a new role, a significant performance challenge, a leadership team that isn\'t clicking, or a personal operating model that hasn\'t caught up with the demands of the job. The common thread is leaders who are good enough to know what they don\'t know — and serious enough to do something about it.',
      'Sessions are structured around your real challenges, not generic leadership frameworks. We bring operator experience — not just coaching credentials — which means we can speak candidly about the commercial realities of what you\'re facing. Engagements are typically six months with bi-weekly sessions, though we can structure around what you actually need.',
    ),

    benefitsHeadline: 'What You Walk Away With',
    benefits: [
      { _key: 'ben1', title: 'A Defined Leadership Identity', description: 'Clarity on who you are as a leader, what your defaults are under pressure, and where your blind spots live.' },
      { _key: 'ben2', title: 'A Personal Operating System', description: 'Practical tools for managing your time, energy, decisions, and relationships at the pace your role demands.' },
      { _key: 'ben3', title: 'Sharper Decision-Making', description: 'A framework for making better decisions faster — especially in ambiguous, high-stakes situations where there\'s no clean answer.' },
      { _key: 'ben4', title: 'Difficult Conversation Skills', description: 'The confidence and technique to have the hard conversations your role requires without damaging the relationships that matter.' },
      { _key: 'ben5', title: 'Board and Investor Presence', description: 'Improved ability to communicate with conviction, navigate board dynamics, and build credibility with investors.' },
    ],

    processHeadline: 'How Coaching Works',
    processSteps: [
      { _key: 'ps1', title: 'Discovery Session', description: 'Before we commit to working together, we spend 90 minutes getting honest about where you are, what you\'re trying to solve, and whether there\'s a fit. Most clients tell us this session alone is worth it.' },
      { _key: 'ps2', title: 'Leadership Assessment', description: 'We use a combination of structured reflection, 360-degree feedback (where appropriate), and direct observation to map your strengths, your defaults under pressure, and your development edges.' },
      { _key: 'ps3', title: 'Coaching Cadence', description: 'Bi-weekly 60-minute sessions structured around your real challenges, not a fixed curriculum. We track progress against a defined set of development goals we agree on together.' },
      { _key: 'ps4', title: 'In-the-Moment Support', description: 'Between sessions, you have access to async support for the moments that can\'t wait — a difficult board conversation, a people decision you\'re wrestling with, a communication challenge that landed wrong.' },
      { _key: 'ps5', title: 'Six-Month Review', description: 'At the midpoint and conclusion of the engagement, we assess progress against your development goals and decide whether to extend, shift focus, or transition out.' },
    ],

    faqHeadline: 'Common Questions',
    faq: [
      { _key: 'faq1', question: 'How is this different from other executive coaches?', answer: answer('Most coaches bring a coaching methodology. We bring that plus operator experience — we\'ve run P&Ls, managed investors, made hard people decisions, and navigated the specific pressures of growth-stage companies. That context changes the quality of the conversation.') },
      { _key: 'faq2', question: 'Who is this not right for?', answer: answer('Leaders who want validation more than growth. Coaching is most effective when you\'re ready to hear hard things and willing to do the work between sessions. If you want someone to confirm you\'re right, we\'re not the right fit.') },
      { _key: 'faq3', question: 'Is this confidential?', answer: answer('Completely. Nothing discussed in coaching sessions is shared with your board, your investors, or your employer. The only exception would be if we believed someone was at risk of serious harm — and we\'d discuss that with you directly before taking any action.') },
      { _key: 'faq4', question: 'Do you work with leaders at companies you\'re also advising?', answer: answer('Sometimes, with appropriate boundaries established upfront. We\'re transparent about potential conflicts and will flag them before we start.') },
      { _key: 'faq5', question: 'How do I know if I need coaching vs. a different kind of support?', answer: answer('Coaching is right when the challenge is about your leadership capacity, your personal effectiveness, or your development as an executive. If the challenge is primarily organizational or strategic, growth advisory may be a better fit — or we may recommend both. We\'ll tell you honestly what we think after the discovery session.') },
      { _key: 'faq6', question: 'What\'s the time commitment?', answer: answer('Bi-weekly 60-minute sessions plus whatever work you do between sessions. The leaders who get the most out of coaching treat it like any other serious professional development investment — they show up prepared and they follow through.') },
    ],

    ctaHeadline: 'The best leaders invest in getting better.',
    ctaBody: 'Start with a no-pressure discovery session. We\'ll be honest about whether coaching is the right next move — and if it is, what that could look like.',
    ctaButtonLabel: 'Schedule a Discovery Session',

    seo: {
      _type: 'seoFields',
      title: 'Executive Coaching for Growth-Stage Leaders | Agile Operator',
      description: 'Outcomes-focused executive coaching for CEOs and senior leaders at growth-stage companies. Honest, operator-informed counsel from Agile Operator.',
      keywords: ['executive coaching', 'CEO coaching', 'leadership coaching', 'growth stage executive coaching', 'c-suite coaching'],
    },
  },

  // ── 3. Interim / Fractional Executive ────────────────────────────────────
  {
    _id: 'pillar-interim-fractional-executive',
    _type: 'servicePillarPage',
    serviceName: 'Interim & Fractional Executive',
    slug: { _type: 'slug', current: 'interim-fractional-executive' },
    heroHeadline: 'Experienced Executive Leadership When You Need It, Without the Long-Term Commitment',
    heroSubhead:
      'Interim and fractional CEO, CMO, and COO engagements for companies navigating transitions, gaps, or rapid scale.',

    introHeadline: 'What Is an Interim or Fractional Executive?',
    introBody: blocks(
      'An interim executive steps into a full-time leadership role on a defined-term basis — typically during a transition, a leadership gap, or a moment of significant organizational change. A fractional executive operates in a part-time senior leadership capacity across a defined set of responsibilities, usually for companies that need experienced leadership but aren\'t yet ready to hire a full-time executive.',
      'Both models solve the same core problem: you need someone in the room who\'s done this before, who can operate at board level, who your team will respect, and who can drive results on day one — not in six months after a typical search process. Whether you\'re navigating a CEO transition, scaling into a new market, stabilizing after an acquisition, or bridging to a permanent hire, we bring operator-earned credibility and a track record of getting companies through hard moments.',
      'Agile Operator doesn\'t send junior resources. When you hire us for an interim or fractional role, you get a senior operator with relevant experience — available to your team, accountable to your board, and clear-eyed about what success looks like on a defined timeline.',
    ),

    benefitsHeadline: 'What You Walk Away With',
    benefits: [
      { _key: 'ben1', title: 'Day-One Credibility', description: 'A leader your board, investors, and team trust from the first meeting — not someone who needs six months to get up to speed.' },
      { _key: 'ben2', title: 'Stabilization Without Distraction', description: 'Your leadership team stays focused on the business while we handle the senior leadership function.' },
      { _key: 'ben3', title: 'Defined Scope and Timeline', description: 'No open-ended commitments. We agree upfront on what success looks like and when we\'re done.' },
      { _key: 'ben4', title: 'Knowledge Transfer', description: 'We don\'t build dependency — we build capability. What we create, your permanent team inherits and can run.' },
      { _key: 'ben5', title: 'Recruiting Support', description: 'Where needed, we help design the role, brief search firms, and evaluate candidates for the permanent hire we\'re bridging to.' },
    ],

    processHeadline: 'How an Engagement Works',
    processSteps: [
      { _key: 'ps1', title: 'Fit and Scope Conversation', description: 'We get specific about what you need: the role, the timeline, the key relationships (board, investors, team), and the definition of success. If we\'re not the right fit, we\'ll say so.' },
      { _key: 'ps2', title: 'Rapid Onboarding', description: 'We move fast. Within the first two weeks, we\'re oriented on your people, your numbers, your board dynamics, and the burning issues. We\'re built for rapid context acquisition.' },
      { _key: 'ps3', title: 'Stabilization and Assessment', description: 'For the first 30–60 days, we focus on stabilizing what needs to be stabilized, assessing what\'s working and what isn\'t, and building credibility with your key stakeholders.' },
      { _key: 'ps4', title: 'Strategic and Operational Leadership', description: 'We operate as a full member of your leadership team — attending board meetings, running your leadership cadence, making decisions, and driving results against the priorities we agree on together.' },
      { _key: 'ps5', title: 'Transition Planning', description: 'From day one, we\'re planning for the day we leave. We build the handoff documentation, support the search process for a permanent hire where applicable, and make sure the transition is clean.' },
    ],

    faqHeadline: 'Common Questions',
    faq: [
      { _key: 'faq1', question: 'What roles do you cover?', answer: answer('Primarily CEO, President, COO, and CMO — with particular depth in growth and go-to-market leadership. If your need is in a different function, we\'ll be honest about whether we\'re the right fit or whether we can point you somewhere better.') },
      { _key: 'faq2', question: 'How quickly can you start?', answer: answer('Typically within one to two weeks from agreement on scope. We run a lean intake process and don\'t require lengthy contracting cycles. When companies need an interim executive, they usually need one now.') },
      { _key: 'faq3', question: 'What\'s the difference between interim and fractional?', answer: answer('Interim is typically full-time (or near full-time) for a defined period — common in CEO transitions, post-M&A stabilization, or sudden leadership gaps. Fractional is part-time and ongoing — common for companies that need VP- or C-suite-level capability without a full-time hire. We\'ll help you determine which model fits your situation.') },
      { _key: 'faq4', question: 'Will you work with our board?', answer: answer('Yes. We\'re comfortable in board meetings, investor conversations, and governance contexts. Many clients find that one of the most valuable aspects of an interim engagement is having someone in the room who can navigate board dynamics with credibility and without the conflict of interest a permanent hire might have.') },
      { _key: 'faq5', question: 'How does pricing work?', answer: answer('Engagements are scoped and priced based on the role scope, time commitment, and duration. Interim engagements are typically structured as monthly retainers. We\'ll be transparent about economics upfront.') },
      { _key: 'faq6', question: 'What happens when the engagement ends?', answer: answer('We plan for the end from the beginning. Our goal is to leave you with a permanent hire in place, or a clear path to one — along with the documentation, operating infrastructure, and institutional knowledge transfer your successor needs to succeed.') },
    ],

    ctaHeadline: 'Don\'t leave a critical role empty longer than you have to.',
    ctaBody: 'Whether you need someone in the room tomorrow or you\'re planning a transition three months out, let\'s talk about what the right engagement could look like.',
    ctaButtonLabel: 'Start the Conversation',

    seo: {
      _type: 'seoFields',
      title: 'Interim & Fractional Executive Leadership | Agile Operator',
      description: 'Experienced interim CEO, CMO, and COO engagements for growth-stage companies. Day-one credibility, defined timelines, and clean handoffs. Agile Operator.',
      keywords: ['interim CEO', 'fractional executive', 'interim COO', 'fractional CMO', 'interim executive leadership'],
    },
  },
]

// ── Map each pillar page ID to the service title it should link to ─────────

const serviceLinks = {
  'pillar-growth-advisory': 'Growth Advisory',
  'pillar-executive-coaching': 'Executive Coaching',
  'pillar-interim-fractional-executive': 'Interim / Fractional Executive',
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀  Starting Sanity seed — project:', client.config().projectId)

  // 1. Upsert the three pillar pages
  for (const page of pages) {
    console.log(`\n📄  Upserting: ${page.serviceName}`)
    const result = await client.createOrReplace(page)
    console.log(`    ✓  ${result._id} (rev ${result._rev})`)
  }

  // 2. Wire each pillar page back to its Service document
  console.log('\n🔗  Linking pillar pages to Service documents…')

  for (const [pillarId, serviceTitle] of Object.entries(serviceLinks)) {
    // Find the service document by title
    const service = await client.fetch(
      `*[_type == "service" && title == $title][0]{ _id }`,
      { title: serviceTitle }
    )

    if (!service) {
      console.warn(`    ⚠️   No Service document found with title "${serviceTitle}" — skipping link`)
      continue
    }

    await client
      .patch(service._id)
      .set({ pillarPage: { _type: 'reference', _ref: pillarId } })
      .commit()

    console.log(`    ✓  Service "${serviceTitle}" (${service._id}) → ${pillarId}`)
  }

  console.log('\n✅  Done! All service pillar pages are live in Sanity.')
  console.log('    Visit your Sanity Studio to review, then publish to go live.')
}

main().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
