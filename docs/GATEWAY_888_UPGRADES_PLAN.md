# Sina Gateway — 888 Real Upgrades Plan

**Status:** Living plan · **Date:** 2026-07-06  
**Author:** Sina Kazemnezhad (founder)  
**Doctrine:** UNLOCK DOCTRINE v2 · receipt-native · no fakes · one audience per season  
**Scope:** Sina Gateway repo + `@Gateway_A` Telegram + venture lane mesh

---

## How to read this

888 concrete upgrades grouped into 11 themes. Each item is a real, buildable action — no padding, no fake metrics, no invented testimonials. Items are numbered 1–888 so you can reference them in commits, PRs, and DMs.

**Priority codes:**
- `NOW` — next 30 days, after launch
- `NEXT` — 30–90 days
- `LATER` — 90+ days / strategic
- `FOUNDER` — only Sina can do (names, decisions, voice)
- `ANTI` — explicit anti-feature (do NOT build)

---

## Theme 1 — Attraction & Marketing (1–80)

### Wedge strategy
1. `NOW` Pick ONE primary wedge for next 90 days (Founder Audit / SourceA / BuildMatch).
2. `NOW` Document wedge decision in `docs/WEDGE_LOCKED_v1.md`.
3. `NOW` Add wedge banner to `public/index.html` based on `utm_campaign`.
4. `NEXT` Lane-specific hero copy for each top-3 campaign.
5. `NEXT` Lane-specific OG image per campaign (`/og.svg` → `/og-founder.svg`, etc.).
6. `LATER` A/B test hero copy variants when traffic justifies.
7. `ANTI` Never run 7 simultaneous marketing campaigns.

### UTM discipline
8. `NOW` Lock UTM taxonomy: `source`, `medium`, `campaign`, `content`, `term`.
9. `NOW` Add UTM validator script (`npm run validate:utm`).
10. `NEXT` Log full UTM chain on every capture (already partial — complete it).
11. `NEXT` Surface `utm_campaign` in Telegram alert message template.
12. `NEXT` Add UTM to success screen reference ID context.
13. `LATER` UTM-based redirect to lane-specific thank-you pages.

### Landing pages (per lane)
14. `NEXT` `/founder-audit` — dedicated offer page (not just UTM param).
15. `NEXT` `/for-clients` — SourceA lane explainer.
16. `NEXT` `/for-investors` — Noetfield lane explainer.
17. `NEXT` `/for-builders` — Forge lane explainer.
18. `LATER` `/for-construction` — BuildMatch Vancouver page.
19. `LATER` `/for-trust` — TrustField compliance page.
20. `ANTI` No fake "trusted by" logos on any landing page.

### Content marketing
21. `NEXT` Write "How a Founder Audit signal gets routed" — public case pattern (no names).
22. `NEXT` Write "What @Gateway_A actually does" — channel charter post.
23. `NEXT` Weekly lane verdict post template (aggregated, no PII).
24. `NEXT` One LinkedIn post/week → single UTM campaign link.
25. `LATER` Founder blog on `sinakazemnezhad.com` → gateway cross-link.
26. `LATER` Twitter/X thread on receipt-native ops (real screenshots).
27. `LATER` YouTube short: 60-sec intake → routing → receipt walkthrough.
28. `ANTI` No fake subscriber counts, no bought followers, no engagement pods.

### SEO
29. `NEXT` Submit sitemap to Google Search Console (post-launch).
30. `NEXT` Add `sitemap.xml` to `public/`.
31. `NEXT` Add canonical URLs to all public pages.
32. `NEXT` Long-tail target: "solo founder accountability intake."
33. `LATER` Long-tail target: "Vancouver construction lead routing" (if BuildMatch wedge).
34. `LATER` Long-tail target: "governed AI execution intake" (if SourceA wedge).
35. `ANTI` No keyword stuffing, no hidden text, no PBN backlinks.

### Referral loops
36. `NEXT` Add `?ref=` shareable URL on success screen (no PII in URL).
37. `NEXT` Track referrer chain in Supabase `referred_by` column.
38. `LATER` Optional "introducer name" field (not required, not stored as PII in URL).
39. `ANTI` No MLM-style multi-tier referral payouts.

### Public proof
40. `NEXT` Add `/status.html` link in footer (already done — keep).
41. `NEXT` Add "Last gateway verdict" timestamp in footer (from heartbeat).
42. `NEXT` Public `/health` and `/ready` endpoints (already live — keep stable).
43. `LATER` Public monthly aggregate report (signal counts by lane, no PII).
44. `ANTI` No fake uptime percentages, no fake "99.9% SLA."

### Social presence
45. `NEXT` Pin `@Gateway_A` charter post.
46. `NEXT` Add Telegram channel link in footer.
47. `NEXT` Add Telegram deep link on success screen (`t.me/GateWay_A_bot?start=...`).
48. `LATER` Cross-post lane verdicts to LinkedIn (manual at first).
49. `ANTI` No auto-DM spam to new Telegram subscribers.

### Custom domain
50. `NOW` Decide custom domain: `gateway.sinakazemnezhad.com` or `sina-gateway.app`.
51. `NEXT` Add custom domain on Railway.
52. `NEXT` Add domain to Turnstile hostnames.
53. `NEXT` Update `ALLOWED_ORIGINS` on Railway.
54. `NEXT` Update OG image URL to custom domain.
55. `LATER` Add second domain for specific lane (e.g., `founderaudit.sinakazemnezhad.com`).

### Email (when ready, not before)
56. `LATER` Add transactional email only when real SMTP chosen.
57. `LATER` Email receipt with reference ID (not fake "we got your message").
58. `LATER` Weekly digest email to founder (aggregated, not per-lead spam).
59. `ANTI` No email before real integration — silent capture is honest.
60. `ANTI` No email marketing list sold or shared.

### Outreach
61. `FOUNDER` Fill 25 real D2 names in `data/founder-audit-d2-list.json`.
62. `FOUNDER` Send first D3 LinkedIn batch (manual, no automation).
63. `FOUNDER` Log sends with `npm run channel:send -- --mark-sent`.
64. `FOUNDER` Sync heartbeat with `npm run sync:heartbeat` after real sends.
65. `NEXT` D3 template refinement based on reply patterns.
66. `NEXT` Track L1 (replies), L2 (payments) in `channel-receipts.json`.
67. `LATER` Warm intro request template (for network-sourced leads).
68. `ANTI` No purchased lead lists, no scraped LinkedIn bulk DMs.

### Launch amplification
69. `NEXT` Launch announcement post (honest: "v1 live, private test done").
70. `NEXT` Update sourcea.app cross-link to gateway.
71. `LATER` Hacker News "Show HN" post (only when genuinely novel angle).
72. `LATER` Indie Hackers post.
73. `ANTI` No "we launched" with fake user counts.

### Continuous attraction
74. `NEXT` Monthly wedge performance review (which UTM converts).
75. `LATER` Quarterly wedge re-decision (stay or switch).
76. `LATER` Annual deep research re-audit (item 201 in 2026 plan).
77. `NEXT` Track CTR per UTM source in Supabase `utm_clicks` table.
78. `NEXT` Add `utm_content` to lane hero banners for variant tracking.
79. `LATER` Partner cross-promo with one aligned solo-founder tool.
80. `ANTI` No paid ads before organic wedge proven.

---

## Theme 2 — Telegram Gateway `@Gateway_A` (81–160)

### Channel (public room)
81. `NOW` Pin charter post: what this channel is, link to intake, privacy, "no spam."
82. `NOW` Channel description with one-line value prop + intake URL.
83. `NEXT` Weekly automated infra verdict post (from heartbeat, infra-only).
84. `NEXT` Weekly aggregated lane stats post (no PII, counts only).
85. `NEXT` Pinned "how to submit a signal" post with deep link.
86. `NEXT` Pinned "what each lane does" post.
87. `LATER` Subscriber milestone posts (honest counts only — "100th subscriber").
88. `ANTI` No fake subscriber counts, no bought members.

### Bot `@GateWay_A_bot`
89. `NEXT` `/start` command — welcome + intake link + lane list.
90. `NEXT` `/start=founder-audit` — pre-fills UTM, returns Founder Audit deep link.
91. `NEXT` `/start=sourcea` — SourceA lane deep link.
92. `NEXT` `/status` command — bot replies with live `/ready` summary.
93. `NEXT` `/lanes` command — list of venture lanes with one-line descriptions.
94. `NEXT` `/privacy` command — link to `/privacy.html`.
95. `LATER` `/help` command — full command list.
96. `LATER` Inline keyboard for lane selection after `/start`.

### Bot intake (Tier 2 — small product)
97. `LATER` `/submit` command — mini-wizard in chat (identity → intent → contact).
98. `LATER` Bot POSTs to same `/api/leads` (reuse schema, validation, Turnstile bypass for bot).
99. `LATER` Bot returns reference ID in chat reply.
100. `LATER` Bot logs Telegram user id hash (not username) for dedup.
101. `ANTI` No storing Telegram usernames in PII-visible way without consent.
102. `ANTI` No bot intake before web intake is stable for 30 days.

### Alert message templates
103. `NOW` Lead alert template polish: lane, priority, reference ID, route_reason.
104. `NEXT` Color-coded priority in message (HIGH / NORMAL / LOW).
105. `NEXT` Add `utm_campaign` to alert message.
106. `NEXT` Add `route_confidence` to alert message.
107. `NEXT` Add contact method summary (email / phone / social).
108. `LATER` Add quick-action inline buttons (Acknowledge / Reply-later / Mark-handled).
109. `LATER` Action buttons write back to Supabase `lead_status` column.

### Heartbeat
110. `NOW` Keep commercial RED only when `COMMERCIAL_ARMED=true` (already done).
111. `NEXT` Add weekly heartbeat post with lane aggregate (infra-only mode).
112. `NEXT` Add heartbeat "uptime since last RED" counter.
113. `NEXT` Add heartbeat "last signal received" timestamp.
114. `LATER` Add heartbeat "top lane this week" (count-based, no names).
115. `ANTI` No fake commercial GREEN before real sends.

### Watchdog
116. `NEXT` Watchdog alert template: failing endpoint + last success time.
117. `NEXT` Add watchdog self-check (worker /health probe).
118. `LATER` Watchdog escalates to personal DM after 3 consecutive RED.
119. `LATER` Watchdog silence window (maintenance mode toggle).

### Deadman
120. `NEXT` Confirm deadman covers gateway endpoints (already verified — keep).
121. `NEXT` Add deadman weekly digest to `@Gateway_A`.
122. `LATER` Deadman auto-restart Railway service on persistent failure (via Railway API).

### Telegram infra
123. `NEXT` Bot webhook vs long-poll — switch to webhook for lower latency.
124. `NEXT` Add `/setwebhook` script (`scripts/set-telegram-webhook.js`).
125. `NEXT` Rate-limit bot commands (prevent abuse).
126. `NEXT` Block bot from non-private chats except `@Gateway_A` channel.
127. `LATER` Multi-language bot responses (en / fa if Iran audience grows).
128. `LATER` Bot analytics dashboard (commands used, intake conversions).

### Channel content cadence
129. `NEXT` Define weekly cadence: Mon verdict, Wed lane highlight, Fri aggregate.
130. `NEXT` Schedule first 4 weeks of content (manual, no auto-posting yet).
131. `LATER` Auto-post infra verdict via gateway-ops cron (already wired — enable).
132. `ANTI` No auto-posting commercial claims.

### Trust on Telegram
133. `NEXT` Add "operator: @sinakazemnezhad" to channel bio.
134. `NEXT` Add channel rules post (no spam, no solicitations, signals only).
135. `NEXT` Add "this is a personal project, not a company" disclaimer.
136. `ANTI` No "24/7 support" claim — solo founder, be honest.

### Telegram integrations
137. `LATER` Telegram Premium giveaway when affordable (real growth lever).
138. `LATER` Telegram Group vs Channel — keep channel for broadcast, group for discussion later.
139. `LATER` Topic-based threads in group (one per lane).
140. `LATER` Cross-post from `@Gateway_A` to LinkedIn via IFTTT (manual review first).

### Subscriber growth
141. `NEXT` Add channel link in every outbound DM signature.
142. `NEXT` Add channel link in email signature (when email added).
143. `NEXT` Add channel link in GitHub profile.
144. `NEXT` Add channel link in sourcea.app footer.
145. `LATER` Cross-promo with one aligned founder channel (mutual, not paid).
146. `ANTI` No paid Telegram member buying.

### Telegram ops hygiene
147. `NOW` Rotate bot token annually (calendar reminder).
148. `NEXT` Backup `data/channel-receipts.json` to R2 weekly.
149. `NEXT` Add `scripts/backup-telegram-state.js` for channel post archive.
150. `LATER` Telegram channel post archive to public web page (optional transparency).

### Message quality
151. `NEXT` Emoji discipline: minimal, lane-coded only (🟢 infra / 🔴 commercial / 📨 lead).
152. `NEXT` Message length cap (Telegram hard limit is 4096 — keep under 1000).
153. `NEXT` Markdown formatting test for all templates.
154. `NEXT` Add `scripts/test-telegram-templates.js`.
155. `LATER` Image attachments for milestone posts (generated, not stock).

### Bot reliability
156. `NEXT` Bot retry on Telegram 429 (rate limit) with exponential backoff.
157. `NEXT` Bot graceful failure if Supabase unreachable (queue + retry).
158. `LATER` Bot dead-letter queue in R2 for failed sends.
159. `LATER` Bot idempotency key per capture (prevent duplicate alerts).
160. `ANTI` No silent alert drops — always log to `gateway_leads`.

---

## Theme 3 — Web Intake & UX (161–240)

### Wizard flow
161. `NEXT` Step 0: 3-tile "What do you need?" for mobile drop-off reduction.
162. `NEXT` Live route preview — make bolder ("Heading to SourceA because…").
163. `NEXT` Add `route_reason` to success screen.
164. `NEXT` Add estimated review window on success screen ("within 48h" — keep honest).
165. `NEXT` Add "Save this reference ID" prompt on success screen.
166. `LATER` Progress bar refinement (current is functional, make it delightful).
167. `LATER` Keyboard navigation for entire wizard (Tab + Enter).
168. `LATER` Voice input for accessibility (Web Speech API, optional).

### Mobile
169. `NOW` Test on iOS Safari and Android Chrome.
170. `NEXT` Optimize form tap targets (44x44 min).
171. `NEXT` Sticky CTA on mobile scroll.
172. `NEXT` Reduce wizard to 3 steps on mobile (collapse optional fields).
173. `LATER` PWA manifest + install prompt.
174. `LATER` Offline capture queue (Service Worker, sync on reconnect).
175. `ANTI` No native app before PWA proves web intake works.

### Turnstile UX
176. `NOW` Loading state during Turnstile verification.
177. `NEXT` "Protected intake" copy near widget (reduces bot fear).
178. `NEXT` Graceful fallback if Turnstile timeout.
179. `NEXT` Accessible label for Turnstile iframe.
180. `LATER` Turnstile theme matches site theme (dark/light).

### Form fields
181. `NEXT` Split contact into email / phone / social / preferred (planned in README).
182. `NEXT` Add "preferred contact method" radio.
183. `NEXT` Add optional "best time to reach" field.
184. `NEXT` Add optional "introducer name" field (not required).
185. `LATER` Smart field reveal based on identity (investor → ask stage; construction → ask city).
186. `ANTI` No required phone (privacy + friction).

### Success screen
187. `NOW` Reference ID prominent + copy button.
188. `NEXT` Routed lane + reason visible.
189. `NEXT` "What happens next" 3-step recap.
190. `NEXT` Telegram deep link button.
191. `NEXT` Optional "submit another signal" button.
192. `LATER` QR code to Telegram channel.

### Routing transparency
193. `NEXT` Show route decision tree on a `/how-routing-works` page.
194. `NEXT` Publish routing rules (already in `ROUTING.md` — surface publicly).
195. `NEXT` Add `route_confidence` to success screen.
196. `LATER` "Why this lane?" explainer per route.

### Trust signals
197. `NOW` Operator line in footer (already done — keep).
198. `NEXT` Privacy link in footer (already done — verify live).
199. `NEXT` Status link in footer (already done — verify live).
200. `NEXT` "Personal founder project, not a company" disclaimer.
201. `NEXT` Last gateway verdict timestamp in footer.
202. `LATER` Founder photo + one-line bio on `/about` (only if comfortable).
203. `ANTI` No fake team page, no fake "we" language.

### Performance
204. `NOW` Lighthouse audit on production.
205. `NEXT` Inline critical CSS.
206. `NEXT` Lazy-load Turnstile script.
207. `NEXT` Compress SVG assets.
208. `NEXT` Add `Cache-Control` headers for static assets.
209. `LATER` Edge CDN (Cloudflare in front of Railway).
210. `LATER` HTTP/3 on custom domain.

### Accessibility
211. `NOW` axe-core scan on all pages.
212. `NEXT` WCAG 2.1 AA compliance for intake form.
213. `NEXT` ARIA labels on all form fields.
214. `NEXT` Color contrast audit (dark mode + light).
215. `NEXT` Screen reader test (VoiceOver on Mac).
216. `LATER` Reduced-motion preference support.
217. `LATER` High-contrast mode toggle.

### Internationalization
218. `LATER` Extract strings to `locales/en.json`.
219. `LATER` Add `fa.json` (Farsi) if Iran audience grows.
220. `LATER` RTL support for Farsi.
221. `ANTI` No auto-translate (quality risk for intake copy).

### Branding
222. `NEXT` Refine `og.svg` — current is functional, make it shareable.
223. `NEXT` Favicon variants (32x32, 180x180, 512x512).
224. `NEXT` Define color palette in CSS variables.
225. `NEXT` Typography audit (current is clean — lock it).
226. `LATER` Brand guide doc (`docs/BRAND_GUIDE_v1.md`).
227. `LATER` Animated logo for Telegram milestone posts.

### Footer
228. `NEXT` Footer link order: Intake / Privacy / Status / Telegram / SourceA.
229. `NEXT` Copyright line with founder name.
230. `NEXT` "Last updated" timestamp on each page.
231. `ANTI` No fake corporate address.

### Header
232. `NEXT` Sticky header with lane switcher on scroll.
233. `NEXT` Breadcrumbs on lane pages.
234. `LATER` Dark mode toggle in header.

### Empty states
235. `NEXT` Wizard "no route matched" graceful fallback.
236. `NEXT` `/status.html` empty state when no signals yet.
237. `NEXT` 404 page with link back to intake.

### Error UX
238. `NOW` Friendly 400 / 403 / 429 / 500 pages.
239. `NEXT` Reference ID on error pages for support.
240. `NEXT` Retry guidance on 429.

---

## Theme 4 — Capture & Data Quality (241–320)

### Capture endpoint
241. `NOW` Confirm `/api/leads` returns useful errors (already done — keep).
242. `NEXT` Add `requestId` to every error response (already done — verify).
243. `NEXT` Rate limit per IP + per origin (already done — tune thresholds).
244. `NEXT` Add request size limit (already done — verify 8KB).
245. `NEXT` Honeypot field (already done — log blocked attempts).
246. `LATER` Add captcha fallback if Turnstile fails persistently.

### Schema
247. `NEXT` Add `referred_by` column to `gateway_leads`.
248. `NEXT` Add `preferred_contact` column.
249. `NEXT` Add `best_time_to_reach` column.
250. `NEXT` Add `introducer_name` column (optional).
251. `NEXT` Add `lead_status` column (new / acknowledged / replied / closed).
252. `NEXT` Add `lead_status_history` JSONB column.
253. `LATER` Add `lead_score` column (computed from rules).
254. `LATER` Add `duplicate_of` column for dedup.

### Data validation
255. `NOW` Email format validation (already done — keep).
256. `NEXT` Phone E.164 normalization.
257. `NEXT` URL validation for company/product field.
258. `NEXT` Reject control characters in free text.
259. `NEXT` Trim whitespace on all fields.
260. `LATER` Profanity filter on raw_notes (manual review queue, not auto-reject).

### Capture metadata
261. `NOW` `is_test` column (already done — keep).
262. `NOW` `app_version` column (already done — keep).
263. `NOW` `environment` column (already done — keep).
264. `NEXT` `capture_version` column (already done — verify).
265. `NEXT` `schema_version` column (already done — verify).
266. `NEXT` `user_agent_hash` column (for bot detection).
267. `NEXT` `referrer` column (for UTM source tracking).
268. `NEXT` `locale` column (browser language).
269. `LATER` `geo_country` column (Cloudflare header, no city precision).

### RLS / security
270. `NOW` Anon INSERT only (already done — keep).
271. `NOW` Anon SELECT denied (already done — keep).
272. `NEXT` Service-role key never in `.env` (already done — verify).
273. `NEXT` Service-role key never in browser bundle (already done — verify).
274. `NEXT` Audit RLS policies quarterly.
275. `LATER` Per-row RLS for founder-only columns (if admin view added).

### Dedup
276. `NEXT` Hash-based dedup (email + name + 1-hour window).
277. `NEXT` Return existing `requestId` if duplicate within window.
278. `LATER` Fuzzy dedup on company name (Levenshtein).

### Data lifecycle
279. `NOW` Test row cleanup via `PRIVATE_TEST_CLEANUP.sql` (founder manual).
280. `NEXT` Add `retention_until` column (TTL per lane).
281. `NEXT` Auto-archive rows older than 12 months to cold table.
282. `LATER` Auto-delete rows with `is_test=true` after 7 days.
283. `LATER` GDPR deletion endpoint (founder-triggered, not auto).

### Backup
284. `NEXT` Daily Supabase export to R2 (`scripts/backup-supabase.js`).
285. `NEXT` Weekly `data/*.json` backup to R2.
286. `LATER` Monthly backup restore drill.

### Analytics
287. `NEXT` `utm_clicks` table for UTM tracking.
288. `NEXT` `page_views` table (privacy-respecting, no cookies).
289. `NEXT` Aggregate weekly report script (`scripts/weekly-report.js`).
290. `NEXT` Conversion funnel: landing → step 1 → submit → receipt.
291. `LATER` Cohort retention by lane.
292. `ANTI` No third-party analytics cookies (Plausible / Fathom only if any).

### Data quality monitoring
293. `NEXT` Daily schema drift check (`scripts/check-schema-drift.js` — already exists, schedule it).
294. `NEXT` Weekly null-field report (which fields are empty most).
295. `NEXT` Weekly invalid-email report.
296. `LATER` Anomaly detection on capture volume.

### Export
297. `NEXT` Founder-only CSV export script (`scripts/export-leads.js`).
298. `NEXT` Export filtered by lane / date range / status.
299. `ANTI` No public export endpoint — founder-only.

### Admin view
300. `LATER` Admin read view (only after real rows exist — README gated this).
301. `LATER` Admin auth via Supabase Auth (magic link).
302. `LATER` Admin actions: mark status, add note, route override.
303. `ANTI` No admin view before 10 real non-test rows.

### Capture reliability
304. `NEXT` Capture retry on Supabase 5xx (already partial — add queue).
305. `NEXT` Local JSON fallback (already exists — verify still works).
306. `NEXT` Fallback sync to Supabase on reconnect.
307. `LATER` Dead-letter queue for failed captures.

### Privacy
308. `NOW` Privacy policy live (already done — keep).
309. `NEXT` Data deletion process documented (founder-gated).
310. `NEXT` Add `/data-deletion` page with manual request path.
311. `NEXT` Cookie disclosure (no tracking cookies — say so).
312. `LATER` Data Processing Addendum for enterprise lane.
313. `ANTI` No hidden tracking pixels.

### Compliance
314. `LATER` PIPEDA review (Canada).
315. `LATER` GDPR review (EU visitors).
316. `LATER` CCPA review (California visitors).
317. `LATER` SOC2-lite self-assessment (if SourceA enterprise wedge).
318. `ANTI` No fake compliance certifications.

### Data minimization
319. `NEXT` Audit which fields are actually used in routing.
320. `NEXT` Remove unused fields from capture payload.

---

## Theme 5 — Routing Intelligence (321–400)

### Current rules
321. `NOW` Lock current routing rules (already in `ROUTING.md`).
322. `NEXT` Publish rules on `/how-routing-works`.
323. `NEXT` Add `route_rule_id` to every capture (already done — verify).
324. `NEXT` Add `route_reason` to every capture (already done — verify).
325. `NEXT` Add `route_confidence` to every capture (already done — verify).

### Rule improvements
326. `NEXT` Add `secondary_route` for ambiguous signals.
327. `NEXT` Confidence threshold for "manual review" queue.
328. `NEXT` Routing test coverage for edge cases (`scripts/test-shared-routing.js` — expand).
329. `LATER` Weighted scoring instead of first-match.
330. `LATER` ML routing (only after 1000+ real rows — not before).

### Lane-specific logic
331. `NEXT` Founder Audit: stricter fit_score pre-filter.
332. `NEXT` SourceA: detect "enterprise" vs "SMB" intent.
333. `NEXT` BuildMatch: geo filter (Vancouver + 50km).
334. `NEXT` Noetfield: capital stage detection (pre-seed / seed / series A).
335. `LATER` TrustField: compliance keyword expansion.
336. `LATER` Forge: collaborator skill matching.

### Routing transparency
337. `NEXT` Show `route_rule_id` in Telegram alert.
338. `NEXT` Show `secondary_route` in admin view (when built).
339. `LATER` Public "routing decision tree" diagram.

### Routing tests
340. `NOW` Keep `npm run audit:routes` green (already done).
341. `NEXT` Add 20+ edge case tests.
342. `NEXT` Add regression test for every rule change.
343. `LATER` Property-based testing for routing.

### Routing analytics
344. `NEXT` Weekly "top route" report.
345. `NEXT` Weekly "low confidence" report.
346. `LATER` Routing drift report (rule changes vs outcomes).

### Manual override
347. `LATER` Founder manual route override in admin view.
348. `LATER` Override logs to `lead_status_history`.
349. `ANTI` No auto-rerouting without founder review.

### Routing performance
350. `NEXT` Routing function benchmark (must be <10ms).
351. `NEXT` Cache compiled rules (already fast — keep).

### Lane health
352. `NEXT` Per-lane signal volume dashboard.
353. `NEXT` Per-lane response time (capture → founder reply).
354. `LATER` Per-lane conversion (signal → L2 payment).

### Routing docs
355. `NEXT` Update `ROUTING.md` with rule change log.
356. `NEXT` Add `docs/ROUTING_DECISIONS_v1.md` for non-obvious choices.

### Routing edge cases
357. `NEXT` Empty raw_notes → default route.
358. `NEXT` Conflicting signals (investor + hire) → secondary route.
359. `NEXT` Spam patterns → honeypot + auto-reject.
360. `NEXT` Non-English raw_notes → still route by keywords.

### Lane-specific UTM
361. `NEXT` Lock UTM campaign values per lane.
362. `NEXT` Validate UTM campaign against lane list.
363. `ANTI` No UTM typos silently misrouting.

### Routing versioning
364. `NEXT` `routing_version` column in `gateway_leads`.
365. `NEXT` Pin routing version per capture for reproducibility.
366. `LATER` Routing version changelog.

### AI routing (careful)
367. `LATER` LLM-assisted routing (only after 500+ labeled rows).
368. `LATER` LLM confidence vs rule confidence comparison.
369. `ANTI` No LLM routing without human reviewable trail.

### Lane death / birth
370. `NEXT` Process for retiring a lane (redirect + archive).
371. `NEXT` Process for adding a lane (schema + rules + tests + docs).
372. `ANTI` No silent lane removal (breaks inbound links).

### Routing fairness
373. `NEXT` Audit for demographic bias in routing keywords.
374. `LATER` Third-party routing fairness audit.

### Routing observability
375. `NEXT` Log every routing decision to `routing_log` table.
376. `NEXT` Weekly routing anomaly report.
377. `LATER` Real-time routing dashboard.

### Lane-specific capture fields
378. `NEXT` Founder Audit: `stage`, `team_size`, `ai_native`.
379. `NEXT` SourceA: `team_size`, `budget_range`, `timeline`.
380. `NEXT` BuildMatch: `city`, `project_type`, `budget_range`.
381. `NEXT` Noetfield: `stage`, `raise_size`, `use_of_funds`.
382. `LATER` TrustField: `compliance_framework`, `jurisdiction`.
383. `LATER` Forge: `skills`, `availability`, `project_interest`.

### Routing confidence calibration
384. `NEXT` Review low-confidence routes monthly.
385. `NEXT` Tune confidence thresholds quarterly.
386. `LATER` Confidence calibration script.

### Routing regression prevention
387. `NEXT` Snapshot routing rules before every change.
388. `NEXT` Run full routing test suite before merge.
389. `ANTI` No routing rule change without test update.

### Routing UX
390. `NEXT` Show routing confidence on success screen.
391. `NEXT` "Why this lane?" tooltip on success screen.
392. `LATER` "Change my lane" link (founder reviews, not auto).

### Lane capacity
393. `NEXT` Track founder review capacity per lane.
394. `NEXT` Auto-pause lane when capacity hit (show "queue full" message).
395. `LATER` Auto-escalate when lane queue > 5.

### Routing documentation
396. `NEXT` Publish routing rules as YAML (`docs/routing-rules.yaml`).
397. `NEXT` Auto-generate `ROUTING.md` from YAML.
398. `LATER` Visual routing tree generator.

### Lane owners
399. `FOUNDER` All lanes owned by Sina (solo founder — document this).
400. `LATER` Lane ownership handoff process (if team grows).

---

## Theme 6 — Ops & Monitoring (401–480)

### Watchdog
401. `NOW` Keep `gateway-ops` cron `*/15` live (already done).
402. `NEXT` Watchdog alert on 3 consecutive RED (already wired — verify).
403. `NEXT` Watchdog self-check (own /health).
404. `NEXT` Watchdog silence window for maintenance.
405. `LATER` Watchdog escalation to SMS (Twilio) after 5 RED.

### Heartbeat
406. `NOW` Keep daily heartbeat (already done).
407. `NEXT` Heartbeat "uptime since last RED" counter.
408. `NEXT` Heartbeat "last signal received" timestamp.
409. `NEXT` Heartbeat lane aggregate (counts only).
410. `ANTI` No fake commercial GREEN (already gated — keep).

### UptimeRobot
411. `FOUNDER` Arm 2 monitors (Step 5 — pending).
412. `NEXT` UptimeRobot status page (public, branded).
413. `NEXT` UptimeRobot alert to `@Gateway_A` on top of Telegram.
414. `LATER` UptimeRobot SSL monitor on custom domain.
415. `LATER` UptimeRobot port monitor on Railway backend.

### Deadman
416. `NOW` Keep deadman covering gateway (already done).
417. `NEXT` Deadman weekly digest to `@Gateway_A`.
418. `LATER` Deadman auto-restart via Railway API.

### Logging
419. `NEXT` Structured JSON logs (already partial — complete).
420. `NEXT` Log retention 30 days.
421. `NEXT` Log search by `requestId`.
422. `LATER` Log drain to R2 for long-term.

### Metrics
423. `NEXT` `/metrics` endpoint (Prometheus format, founder-only).
424. `NEXT` Capture count, latency, error rate.
425. `NEXT` Per-lane metrics.
426. `LATER` Grafana dashboard (Cloudflare Workers Analytics or self-hosted).

### Alerting
427. `NOW` Telegram alerts for high-priority leads (already done).
428. `NEXT` Telegram alerts for 5xx error spikes.
429. `NEXT` Telegram alert for Supabase unreachable.
430. `LATER` Email alert for daily digest (when email added).
431. `ANTI` No fake alert spam.

### Incident response
432. `NEXT` Incident response doc (`docs/INCIDENT_RESPONSE_v1.md`).
433. `NEXT` Postmortem template (`docs/POSTMORTEM_TEMPLATE.md`).
434. `NEXT` Runbook for common failures.
435. `LATER` Status page incident history (public).

### Deployment
436. `NOW` Railway auto-deploy from `main` (already done).
437. `NEXT` Deploy rollback script (`scripts/railway-rollback.js`).
438. `NEXT` Deploy health check post-deploy (`scripts/post-deploy-check.js`).
439. `LATER` Blue-green deploy on Railway (when supported).
440. `LATER` Canary deploy for routing rule changes.

### CI
441. `NOW` Keep Gateway CI green (already done).
442. `NEXT` Add lint to CI (eslint + prettier).
443. `NEXT` Add `npm run launch:gate` to CI.
444. `NEXT` Add `npm run monitors:verify` to CI.
445. `LATER` Add Playwright E2E to CI.
446. `LATER` Add Lighthouse CI.

### Cost monitoring
447. `NEXT` Monthly Railway cost report.
448. `NEXT` Monthly Supabase cost report.
449. `NEXT` Monthly Cloudflare Workers cost report.
450. `NEXT` Cost alert at $10/mo, $25/mo, $50/mo.
451. `ANTI` No surprise bill > $50/mo without founder approval.

### Capacity
452. `NEXT` Railway service metrics (CPU, memory).
453. `NEXT` Supabase storage + row count.
454. `NEXT` Set Railway scaling limits.
455. `LATER` Load test before any marketing spike.

### Security monitoring
456. `NEXT` Weekly failed-capture log review.
457. `NEXT` Weekly honeypot-blocked log review.
458. `NEXT` Rate-limit hit report.
459. `LATER` Suspicious IP pattern detection.

### Backup verification
460. `NEXT` Weekly backup integrity check.
461. `NEXT` Monthly backup restore test.
462. `LATER` Multi-region backup (R2 + B2).

### Documentation ops
463. `NEXT` Keep `docs/` in sync with code changes.
464. `NEXT` Quarterly doc audit.
465. `NEXT` Doc link checker in CI.
466. `LATER` Auto-generate API docs from OpenAPI.

### Runbook automation
467. `NEXT` `scripts/ops-daily.js` — run all daily checks in one command.
468. `NEXT` `scripts/ops-weekly.js` — weekly aggregate + report.
469. `NEXT` `scripts/ops-monthly.js` — monthly cost + capacity.

### Disaster recovery
470. `NEXT` DR plan doc (`docs/DR_PLAN_v1.md`).
471. `NEXT` RPO / RTO targets (1 hour / 4 hours).
472. `LATER` Multi-region failover (Railway + Cloudflare).

### On-call
473. `FOUNDER` Solo on-call (document this honestly).
474. `NEXT` On-call schedule doc (founder 24/7 — be honest about limits).
475. `ANTI` No "24/7 support" claim while solo.

### Status page
476. `NOW` `/status.html` live (already done).
477. `NEXT` Add incident history to status page.
478. `NEXT` Add uptime percentage (calculated, not faked).
479. `LATER` Status page subscriber notifications.

### Maintenance windows
480. `NEXT` Maintenance window scheduler + Telegram announcement.

---

## Theme 7 — Founder Audit Product (481–540)

### Offer
481. `NOW` Lock offer at $500 (already done — keep).
482. `NEXT` Publish `/founder-audit` offer page.
483. `NEXT` Offer includes: what's included, what's not, delivery time.
484. `NEXT` Refund policy (founder-decided, honest).
485. `ANTI` No fake "money-back guarantee" without honoring it.

### D2 list
486. `FOUNDER` Fill 25 real names (Step 7 — pending).
487. `FOUNDER` Validate with `npm run validate:d2-list`.
488. `NEXT` D2 criteria doc (already locked — keep).
489. `NEXT` D2 fit_score review monthly.
490. `ANTI` No invented contacts.

### D3 outbound
491. `FOUNDER` First batch LinkedIn DMs (Step 9 — pending).
492. `NEXT` D3 template (already locked — keep).
493. `NEXT` Track sends / replies / L1 / L2 in `channel-receipts.json`.
494. `NEXT` Sync heartbeat after real sends.
495. `LATER` D3 channel expansion (Slack / Discord / warm intro).

### Product delivery
496. `NEXT` Founder Audit delivery checklist (`docs/FA_DELIVERY_CHECKLIST.md`).
497. `NEXT` Audit report template (`docs/FA_REPORT_TEMPLATE.md`).
498. `NEXT` Delivery timeline: 5 business days from payment.
499. `LATER` Self-serve audit intake form (Tier 2 product).

### Pricing
500. `NOW` $500 v1 (already locked).
501. `LATER` Tier 2: $1500 with implementation.
502. `LATER` Tier 3: $5000 monthly retainer.
503. `ANTI` No fake "limited time offer" pressure.

### Proof
504. `LATER` First case study (only with explicit written consent).
505. `LATER` Aggregate outcome stats (after 10 audits).
506. `ANTI` No fake testimonials.

### Audience expansion
507. `LATER` Adjacent audience: solo technical PMs.
508. `LATER` Adjent: solo technical designers.
509. `ANTI` No broad "any founder" targeting.

### Channels
510. `NOW` LinkedIn only for first batch (already locked).
511. `LATER` Slack community outreach (founder-led).
512. `LATER` Warm intro from first 5 customers.

### Productization
513. `LATER` Self-serve intake → automated report generation.
514. `LATER` AI cofounder platform (FOUNDER_GATEWAY_BLUEPRINT).
515. `LATER` Decision Ledger productization.

### Customer success
516. `NEXT` Post-audit check-in template (30 / 60 / 90 day).
517. `NEXT` Referral ask script (after positive outcome).
518. `ANTI` No aggressive upsell in first 30 days.

### Content
519. `NEXT` "What a Founder Audit actually does" long-form post.
520. `NEXT` "Solo founder accountability" content series.
521. `LATER` Founder Audit podcast guesting.

### Sales
522. `NEXT` Discovery call script (15 min, free).
523. `NEXT` Qualification checklist.
524. `NEXT` Proposal template (1-page, honest).
525. `ANTI` No high-pressure sales tactics.

### Delivery quality
526. `NEXT` Audit quality rubric (`docs/FA_QUALITY_RUBRIC.md`).
527. `NEXT` Founder self-review after each audit.
528. `LATER` Peer review with one trusted advisor.

### Automation
529. `LATER` Pre-audit intake form → auto-generate question set.
530. `LATER` Audit report auto-draft from intake answers.
531. `ANTI` No fully automated audit (founder judgment required).

### Pricing experiments
532. `LATER` A/B test $500 vs $750 (after 10 customers).
533. `LATER` Value-based pricing for enterprise lane.

### Retention
534. `LATER` Monthly check-in offer ($200/mo).
535. `LATER` Annual audit retainer ($5000/yr).

### Partnerships
536. `LATER` One aligned solo-founder coach referral partnership.
537. `ANTI` No reseller agreements that dilute brand.

### Founder Audit brand
538. `NEXT` Lock visual identity for Founder Audit (separate from gateway).
539. `NEXT` Founder Audit one-pager PDF.
540. `ANTI` No "we audited 100+ founders" before doing 10.

---

## Theme 8 — SourceA & Venture Lanes (541–620)

### SourceA
541. `NEXT` SourceA lane explainer on `/for-clients`.
542. `NEXT` SourceA case pattern (governed execution, no fake names).
543. `NEXT` SourceA cross-link from `sourcea.app`.
544. `NEXT` SourceA UTM campaign lock.
545. `LATER` SourceA pricing page (if productized).

### Noetfield
546. `NEXT` Noetfield lane explainer on `/for-investors`.
547. `NEXT` Noetfield OG image.
548. `NEXT` Noetfield UTM campaign lock.
549. `LATER` Noetfield capital intake form.

### TrustField
550. `NEXT` TrustField lane explainer on `/for-trust`.
551. `NEXT` TrustField compliance keyword expansion.
552. `LATER` TrustField DPA template.

### BuildMatch
553. `NEXT` BuildMatch lane explainer on `/for-construction`.
554. `NEXT` BuildMatch geo filter (Vancouver + 50km).
555. `NEXT` BuildMatch local SEO target.
556. `LATER` BuildMatch contractor referral network.

### Forge
557. `NEXT` Forge lane explainer on `/for-builders`.
558. `NEXT` Forge collaborator matching rules.
559. `LATER` Forge community Discord.

### Personal
560. `ANTI` No marketing for Personal lane (friends only).
561. `NEXT` Personal lane handling: low-priority, no Telegram alert.

### Lane mesh
562. `NEXT` Mesh diagram in `docs/LANE_MESH_v1.md`.
563. `NEXT` One-way link rule: external → gateway → lane.
564. `ANTI` No circular links between lanes.
565. `NEXT` Lane health dashboard (signal volume per lane).

### Lane-specific intake
566. `NEXT` Founder Audit intake: stage, team, AI-native.
567. `NEXT` SourceA intake: budget, timeline, team size.
568. `NEXT` BuildMatch intake: city, project type, budget.
569. `NEXT` Noetfield intake: stage, raise size, use of funds.
570. `LATER` TrustField intake: framework, jurisdiction.

### Lane exit
571. `NEXT` Lane exit process (redirect + archive + notify).
572. `ANTI` No silent lane removal.

### Lane cross-promo
573. `NEXT` SourceA success → mention Founder Audit (if fit).
574. `NEXT` Founder Audit → mention SourceA (if execution need).
575. `ANTI` No aggressive cross-sell.

### Lane-specific Telegram
576. `NEXT` SourceA alert template (enterprise tone).
577. `NEXT` Founder Audit alert template (founder tone).
578. `NEXT` BuildMatch alert template (local tone).

### Lane metrics
579. `NEXT` Per-lane conversion dashboard.
580. `NEXT` Per-lane response time.
581. `NEXT` Per-lane founder review capacity.

### Lane docs
582. `NEXT` One-pager per lane (`docs/LANE_<name>_v1.md`).
583. `NEXT` Lane owner matrix (all Sina for now).
584. `LATER` Lane handoff process.

### Lane brand
585. `NEXT` Consistent naming (SourceA not Source-A).
586. `NEXT` Lane color coding in UI.
587. `LATER` Lane-specific favicons on landing pages.

### Lane-specific Turnstile
588. `LATER` Per-lane Turnstile widget config.
589. `NEXT` Per-lane UTM validation.

### Lane partnerships
590. `LATER` BuildMatch contractor partnerships.
591. `LATER` Noetfield VC partnerships.
592. `ANTI` No partner logos before signed agreement.

### Lane revenue
593. `NEXT` Founder Audit: $500 (locked).
594. `LATER` SourceA: project-based pricing.
595. `LATER` BuildMatch: lead fee or referral.
596. `LATER` Noetfield: advisory retainer.
597. `ANTI` No fake revenue claims.

### Lane-specific privacy
598. `NEXT` Per-lane privacy notice (extra paragraph on `/privacy.html`).
599. `NEXT` BuildMatch: no PII shared with contractors without consent.

### Lane-specific data retention
600. `NEXT` Founder Audit: 24 months.
601. `NEXT` SourceA: 12 months.
602. `NEXT` BuildMatch: 6 months.
603. `LATER` Per-lane retention automation.

### Lane-specific security
604. `NEXT` Enterprise lane (SourceA): DPA + SOC2-lite.
605. `NEXT` Founder Audit: standard privacy.
606. `ANTI` No fake enterprise certifications.

### Lane expansion
607. `LATER` New lane process: schema + rules + tests + docs + UTM.
608. `LATER` Lane retirement process.

### Lane-specific routing
609. `NEXT` Founder Audit: campaign + fit_score gate.
610. `NEXT` SourceA: enterprise vs SMB split.
611. `NEXT` BuildMatch: geo gate.
612. `LATER` Noetfield: stage gate.

### Lane-specific UX
613. `NEXT` Founder Audit landing: offer + price + delivery.
614. `NEXT` SourceA landing: case pattern + CTA.
615. `NEXT` BuildMatch landing: geo + project type.

### Lane-specific content
616. `NEXT` Founder Audit: accountability content.
617. `NEXT` SourceA: governed execution content.
618. `NEXT` BuildMatch: Vancouver construction content.

### Lane trust
619. `NEXT` Per-lane reference ID prefix (FA- / SA- / BM- / NF-).
620. `NEXT` Per-lane success screen variant.

---

## Theme 9 — Trust, Privacy, Security (621–700)

### Privacy
621. `NOW` `/privacy.html` live (already done).
622. `NEXT` Data deletion process documented.
623. `NEXT` `/data-deletion` page with manual request path.
624. `NEXT` Cookie disclosure (none — say so).
625. `NEXT` Annual privacy review.
626. `LATER` PIPEDA / GDPR / CCPA review.
627. `ANTI` No hidden tracking.

### Security
628. `NOW` Anon INSERT only (already done).
629. `NOW` Anon SELECT denied (already done).
630. `NOW` No service-role in `.env` (already done).
631. `NOW` No service-role in browser (already done).
632. `NEXT` Quarterly RLS audit.
633. `NEXT` Quarterly dependency audit (`npm audit`).
634. `NEXT` Annual secrets rotation.
635. `LATER` Snyk / Dependabot on repo.

### Transport
636. `NOW` HTTPS only (Railway + Cloudflare — already done).
637. `NEXT` HSTS header on all responses.
638. `NEXT` CSP header (strict, no inline).
639. `NEXT` X-Frame-Options: DENY.
640. `NEXT` X-Content-Type-Options: nosniff.
641. `NEXT` Referrer-Policy: strict-origin-when-cross-origin.
642. `NEXT` Permissions-Policy (disable camera, mic, geolocation).
643. `LATER` Subresource Integrity for static assets.

### Bot protection
644. `NOW` Turnstile on production (already done).
645. `NEXT` Honeypot field (already done — log blocked).
646. `NEXT` Rate limiting per IP (already done — tune).
647. `NEXT` Rate limiting per origin.
648. `NEXT` User-agent blocklist (obvious bots).
649. `LATER` Cloudflare WAF rules.

### Input validation
650. `NOW` Email format validation (already done).
651. `NEXT` Phone E.164 normalization.
652. `NEXT` URL validation.
653. `NEXT` Field length limits.
654. `NEXT` Control character rejection.
655. `NEXT` HTML entity encoding on output.
656. `ANTI` No raw HTML in responses.

### Secrets management
657. `NOW` `.env` gitignored (already done).
658. `NEXT` `scripts/sync:railway` for env sync (already done).
659. `NEXT` Annual bot token rotation.
660. `NEXT` Annual Supabase anon key rotation (if compromised).
661. `LATER` Secrets Store (Cloudflare) for worker secrets.

### Audit log
662. `NEXT` `audit_log` table for founder actions.
663. `NEXT` Log every admin action (when admin view built).
664. `ANTI` No silent admin actions.

### Vulnerability response
665. `NEXT` Vulnerability response doc (`docs/VULN_RESPONSE_v1.md`).
666. `NEXT` 48-hour ack for reported vulns.
667. `NEXT` 7-day patch for critical vulns.
668. `LATER` Bug bounty (small, honest — $100–$500).

### Pen test
669. `LATER` Annual self-pen-test (OWASP ZAP).
670. `LATER` Third-party pen test (if enterprise wedge).

### Compliance
671. `LATER` PIPEDA self-assessment.
672. `LATER` GDPR self-assessment.
673. `LATER` CCPA self-assessment.
674. `LATER` SOC2-lite (if SourceA enterprise).
675. `ANTI` No fake certifications.

### Data subject rights
676. `NEXT` Data access request process (manual, 30-day SLA).
677. `NEXT` Data deletion request process (manual, 30-day SLA).
678. `NEXT` Data correction request process.
679. `LATER` Self-serve DSR portal (if scale justifies).

### Breach response
680. `NEXT` Breach response doc (`docs/BREACH_RESPONSE_v1.md`).
681. `NEXT` 72-hour notification commitment.
682. `LATER` Breach notification template.

### Encryption
683. `NOW` TLS in transit (already done).
684. `NEXT` At-rest encryption (Supabase default — verify).
685. `LATER` Field-level encryption for PII columns.

### Access control
686. `NOW` Founder-only admin (already done — no admin view yet).
687. `NEXT` Admin auth via Supabase Auth (when built).
688. `NEXT` Admin MFA.
689. `ANTI` No shared admin credentials.

### Dependency security
690. `NEXT` `npm audit` weekly.
691. `NEXT` Dependabot alerts.
692. `NEXT` Lockfile integrity (already done — keep).
693. `LATER` Snyk continuous scan.

### CDN security
694. `LATER` Cloudflare in front of Railway.
695. `LATER` Cloudflare DDoS protection.
696. `LATER` Cloudflare Bot Management.

### API security
697. `NOW` CORS locked to `ALLOWED_ORIGINS` (already done).
698. `NEXT` API rate limit (already done — tune).
699. `NEXT` API key auth for founder-only endpoints.
700. `ANTI` No unauthenticated admin endpoints.

---

## Theme 10 — Developer Experience & Code Quality (701–790)

### Code quality
701. `NEXT` ESLint config (`eslint.config.js`).
702. `NEXT` Prettier config (`.prettierrc`).
703. `NEXT` Run lint in CI.
704. `NEXT` Run format check in CI.
705. `NEXT` Reduce `npm run check` to a single linter pass.
706. `LATER` TypeScript migration (start with `src/`).

### Tests
707. `NOW` Keep `npm test` green (already done).
708. `NEXT` Unit test coverage > 60%.
709. `NEXT` Integration test for `/api/leads`.
710. `NEXT` E2E test with Playwright.
711. `NEXT` Routing test coverage (already good — expand edge cases).
712. `NEXT` Snapshot test for public pages.
713. `LATER` Mutation testing (Stryker).

### CI
714. `NOW` Keep Gateway CI green (already done).
715. `NEXT` Parallelize CI jobs.
716. `NEXT` Cache npm install (already done — keep).
717. `NEXT` Add Lighthouse CI.
718. `LATER` Add bundle size check.

### Scripts
719. `NEXT` Consolidate `npm run` scripts documentation.
720. `NEXT` Add `npm run ops:daily` aggregator.
721. `NEXT` Add `npm run ops:weekly` aggregator.
722. `NEXT` Add `npm run ops:monthly` aggregator.
723. `NEXT` Add `npm run lint`.
724. `NEXT` Add `npm run format`.
725. `NEXT` Add `npm run format:check`.

### Documentation
726. `NEXT` README table of contents.
727. `NEXT` CONTRIBUTING.md (even if solo — for future).
728. `NEXT` ARCHITECTURE.md.
729. `NEXT` API docs (`docs/API_v1.md`).
730. `NEXT` Script index (`docs/SCRIPTS.md`).
731. `LATER` Auto-generated API docs (OpenAPI).

### Repo hygiene
732. `NEXT` Branch naming convention doc (already `cursor/`).
733. `NEXT` PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
734. `NEXT` Issue template (`.github/ISSUE_TEMPLATE/`).
735. `NEXT` CODEOWNERS (Sina only for now).
736. `NEXT` Delete merged branches automatically.
737. `ANTI` No force-push to `main`.

### Dependency management
738. `NEXT` Quarterly dependency update.
739. `NEXT` Renovate or Dependabot.
740. `NEXT` Lockfile committed (already done).
741. `LATER` Bundle analysis (`npm run bundle:analyze`).

### Performance
742. `NEXT` Lighthouse CI threshold (90+ perf).
743. `NEXT` Bundle size budget.
744. `NEXT` Image optimization pipeline.
745. `LATER` Edge caching for static assets.

### Refactoring
746. `NEXT` Extract routing rules to YAML.
747. `NEXT` Extract Telegram templates to module.
748. `NEXT` Extract form fields to schema.
749. `LATER` Modularize `src/server.js` (currently monolithic).

### Type safety
750. `LATER` JSDoc types on all functions.
751. `LATER` TypeScript for `src/` (start with `gateway.js`).
752. `LATER` TypeScript for `scripts/`.

### Error handling
753. `NEXT` Standardize error response shape.
754. `NEXT` Custom error classes.
755. `NEXT` Error code registry (`docs/ERROR_CODES.md`).

### Logging
756. `NEXT` Structured JSON logs (already partial).
757. `NEXT` Log levels (debug / info / warn / error).
758. `NEXT` Log sampling in production.

### Configuration
759. `NEXT` Config validation on startup (`scripts/validate-env.js` — already exists, expand).
760. `NEXT` Environment-specific configs (dev / prod / test).
761. `ANTI` No hardcoded URLs.

### Build
762. `NEXT` Keep zero-build (already done — plain Node).
763. `LATER` Bundler only if bundle size > 200KB.

### Local dev
764. `NEXT` `npm run dev` with auto-reload (nodemon).
765. `NEXT` `.env.example` complete (already done — keep).
766. `NEXT` Docker compose for local Supabase (optional).

### Testing infrastructure
767. `NEXT` Test fixtures (`tests/fixtures/`).
768. `NEXT` Mock Supabase in unit tests.
769. `NEXT` Mock Telegram in unit tests.
770. `LATER` Test database (separate Supabase project).

### Code review
771. `FOUNDER` Self-review checklist before every commit.
772. `LATER` Bugbot on every PR (already available).
773. `LATER` Security review on every PR (already available).

### Performance profiling
774. `NEXT` Profile `/api/leads` under load.
775. `NEXT` Profile routing function.
776. `LATER` Continuous profiling in production.

### Observability
777. `NEXT` Request ID in every log (already done — verify).
778. `NEXT` Trace every capture end-to-end.
779. `LATER` Distributed tracing (OpenTelemetry).

### Release process
780. `NOW` Merge to `main` → auto-deploy (already done).
781. `NEXT` Release notes per merge (CHANGELOG.md).
782. `NEXT` Tag releases (`v1.0.0`, `v1.1.0`).
783. `LATER` Semantic versioning automation.

### Backward compat
784. `NEXT` API versioning (`/api/v1/leads`).
785. `NEXT` Deprecation policy.
786. `ANTI` No silent breaking API changes.

### DX polish
787. `NEXT` `npm run` help index (`scripts/help.js`).
788. `NEXT` Shell completion script (optional).
789. `LATER` VSCode workspace settings (`.vscode/`).
790. `ANTI` No dev-only configs in production.

---

## Theme 11 — Revenue, Scale, Founder Life (791–888)

### Revenue models
791. `NOW` Founder Audit: $500 (locked).
792. `LATER` SourceA: project-based ($5k–$50k).
793. `LATER` BuildMatch: lead fee ($50–$500) or referral (10%).
794. `LATER` Noetfield: advisory retainer ($2k–$10k/mo).
795. `LATER` TrustField: compliance audit ($3k–$15k).
796. `LATER` Forge: marketplace fee (later).
797. `ANTI` No fake revenue projections.

### Pricing discipline
798. `NEXT` Document pricing rationale per lane.
799. `NEXT` Annual pricing review.
800. `ANTI` No race-to-the-bottom discounting.

### Customer acquisition cost
801. `NEXT` Track time per D3 send (manual cost).
802. `NEXT` Track conversion D3 → L1 → L2.
803. `LATER` CAC target: <$100 for Founder Audit.

### Lifetime value
804. `LATER` LTV per lane (after 10 customers).
805. `LATER` LTV:CAC target > 3.

### Revenue diversification
806. `NOW` One revenue stream (Founder Audit).
807. `LATER` Second stream only after first is proven.
808. `ANTI` No 7 simultaneous revenue experiments.

### Scale
809. `NEXT` Document solo capacity (10 audits/mo max).
810. `NEXT` Auto-pause intake when queue > 5.
811. `LATER` First hire: ops assistant (after 20 audits).
812. `LATER` Second hire: routing engineer (after 100 audits).
813. `ANTI` No premature hiring.

### Founder life
814. `FOUNDER` Daily 15-min gateway review (manual).
815. `FOUNDER` Weekly 1-hour ops review.
816. `FOUNDER` Monthly 2-hour strategic review.
817. `FOUNDER` Annual 1-week deep audit.
818. `ANTI` No 80-hour weeks sustained.

### Burnout prevention
819. `NEXT` Max 5 D3 sends per day.
820. `NEXT` Max 10 audits per month.
821. `NEXT` Mandatory 1 day off per week.
822. `ANTI` No "always on" founder myth.

### Brand
823. `NEXT` Lock personal brand voice (blunt, receipt-native, no fluff).
824. `NEXT` One sentence: "Sina builds governed intake systems for solo founders."
825. `LATER` Personal brand guide doc.
826. `ANTI` No fake "we" language on solo project.

### Public presence
827. `NEXT` LinkedIn profile update with gateway link.
828. `NEXT` GitHub profile update with gateway link.
829. `NEXT` Twitter/X profile (if used) with gateway link.
830. `LATER` Personal site `sinakazemnezhad.com` cross-link.

### Content cadence
831. `NEXT` 1 LinkedIn post per week (sustainable).
832. `NEXT` 1 Telegram verdict per week.
833. `NEXT` 1 long-form per month.
834. `ANTI` No daily content burnout.

### Network
835. `NEXT` 1 founder conversation per week (D2 pipeline).
836. `NEXT` 1 advisor conversation per month.
837. `LATER` 1 conference per quarter.

### Learning
838. `NEXT` 1 book per quarter (founder-relevant).
839. `NEXT` 1 course per year.
840. `ANTI` No course hoarding without application.

### Health
841. `FOUNDER` Sleep 7h minimum.
842. `FOUNDER` Exercise 3x per week.
843. `ANTI` No founder martyrdom.

### Exit strategy
844. `LATER` Document exit options (acquire, wind down, hand off).
845. `LATER` Annual exit decision (build, sell, or close).
846. `ANTI` No "build to flip" from day 1.

### Legacy
847. `NEXT` Document "why this exists" (`docs/WHY_v1.md`).
848. `NEXT` Document "what success looks like in 5 years."
849. `LATER` Open-source parts that should outlive the project.

### Decision log
850. `NEXT` Founder decision log (`docs/FOUNDER_DECISIONS_v1.md`).
851. `NEXT` Log every material decision (UNLOCK DOCTRINE).
852. `NEXT` Quarterly decision review.

### Anti-fake discipline
853. `NOW` No fake testimonials (already locked).
854. `NOW` No fake commercial GREEN (already locked).
855. `NOW` No fake "we" language (already locked).
856. `NOW` No fake corporate entity (already locked).
857. `NOW` No fake email acks (already locked).
858. `NOW` No fake uptime (already locked).
859. `NOW` No fake certifications (already locked).
860. `NOW` No fake subscriber counts (already locked).
861. `NOW` No fake team page (already locked).
862. `NOW` No fake "24/7 support" (already locked).

### Receipt-native ops
863. `NOW` Every signal has `requestId` (already done).
864. `NOW` Every alert has reference ID (already done).
865. `NEXT` Every founder action logged.
866. `NEXT` Weekly aggregate published (when ready).
867. `LATER` Monthly public report.
868. `LATER` Annual public report.

### The 888th upgrade
869. `NOW` **Pick one wedge and ship it for 90 days.**
870. `NOW` **One audience, one UTM, one Telegram story.**
871. `NOW` **Receipts over promises.**
872. `NOW` **Real signals over fake growth.**
873. `NOW` **Honest RED over fake GREEN.**
874. `NOW` **One lane great before seven lanes good.**
875. `NOW` **Founder health before founder burnout.**
876. `NOW` **Decision log before feature log.**
877. `NOW` **Privacy before growth.**
878. `NOW` **Receipt-native before receipt-decorated.**
879. `NOW` **Solo before team.**
880. `NOW` **Live before perfect.**
881. `NOW` **Honest before impressive.**
882. `NOW` **Specific before broad.**
883. `NOW` **One wedge before seven campaigns.**
884. `NOW` **Reference ID before testimonial.**
885. `NOW` **Routing reason before routing magic.**
886. `NOW` **Telegram charter before Telegram spam.**
887. `NOW` **Privacy page before marketing page.**
888. `NOW` **Stop planning. Ship the wedge.**

---

## How to use this plan

1. **Pick one `NOW` item per week** — not ten.
2. **Reference item numbers in commits** — e.g., `Add /founder-audit landing (#14)`.
3. **Quarterly review** — mark items done, retire stale ones, add new ones.
4. **Never break anti-features** — they exist to keep the project honest.
5. **The 888th upgrade is the only one that matters**: pick a wedge and ship it.

---

## Final principle

**The system exists to reduce mess, not create more.**

If the upgrade is bigger than the fix, the upgrade is wrong.

If the upgrade requires faking something, the upgrade is wrong.

If the upgrade doesn't serve one real audience, the upgrade is wrong.

**Ship the wedge. Log the receipt. Repeat.**
