# Sina Gateway: 300 Product Upgrade Plans

Perspective: June 2026 product roadmap based on the current Sina Gateway implementation, readiness checks, Supabase/RLS constraints, notification status, local E2E coverage, routing model, and private-test readiness analysis.

## 1. Private Test Readiness
1. Run `supabase/schema.sql` in Supabase SQL Editor.
2. Run `npm run verify:supabase` from a network-enabled shell.
3. Confirm anon insert returns `INSERT OK`.
4. Confirm anon read returns zero visible rows.
5. Submit one private test lead through the browser.
6. Confirm the browser-submitted lead appears in Supabase.
7. Confirm no lead rows are readable with anon key.
8. Add a manual test-lead naming convention.
9. Add a cleanup policy for test leads.
10. Keep `robots.txt` blocked during private testing.
11. Keep `noindex,nofollow` during private testing.
12. Add a private-test checklist to the README.
13. Add a short “private test mode” operator note.
14. Add a founder-only test script with exact steps.
15. Confirm local fallback is disabled when Supabase env is present.
16. Confirm local fallback works when Supabase env is removed.
17. Test malformed JSON returns `400`.
18. Test oversized payload returns `413`.
19. Test honeypot submission does not create a real lead.
20. Test rate limit does not block normal submissions.
21. Test rate limit blocks repeated spam-like submissions.
22. Test all wizard paths on desktop.
23. Test all wizard paths on mobile.
24. Test back button behavior on every wizard step.
25. Test form recovery after failed capture.
26. Test success state after capture.
27. Test route preview before submit.
28. Test route result after submit.
29. Record private-test findings in the readiness receipt.
30. Freeze product scope until private-test feedback is reviewed.

## 2. Supabase And Data Integrity
31. Treat `supabase/schema.sql` as the canonical schema.
32. Run schema drift check before every release.
33. Add schema drift check to CI when CI exists.
34. Add SQL comments explaining the insert-only RLS model.
35. Add explicit “no anon select” verification docs.
36. Add a migration log table only if migrations become frequent.
37. Add `capture_version` to each lead.
38. Add `schema_version` to each lead.
39. Add `app_version` to each lead.
40. Add `environment` to each lead.
41. Add `is_test` boolean for test submissions.
42. Add `deleted_at` for soft deletion.
43. Add `retention_review_at` for privacy hygiene.
44. Add `consent_version` for contact consent tracking.
45. Add `privacy_policy_version`.
46. Add normalized `contact_email`.
47. Add normalized `contact_phone`.
48. Add normalized `contact_social`.
49. Keep original `contact` as raw user-provided value.
50. Add `contact_fingerprint` for dedupe without exposing raw contact.
51. Add duplicate detection by contact fingerprint.
52. Add duplicate detection by company plus name.
53. Add duplicate detection by session and contact.
54. Add `duplicate_confidence`.
55. Add `duplicate_reason`.
56. Add table indexes for `created_at`, `priority_tag`, and `status`.
57. Add table index for `contact_fingerprint`.
58. Add table index for `venture_route`.
59. Add table index for `source`.
60. Add a weekly schema/data quality review.

## 3. Routing And Classification
61. Keep routing deterministic until meaningful lead volume exists.
62. Keep `ROUTING_RULE_DEFINITIONS` as the route source of truth.
63. Keep frontend route preview powered by server-provided config.
64. Add route config version to `/api/config`.
65. Add route rule count to `/ready`.
66. Add route rule ID to success response.
67. Add secondary route to success response.
68. Add route confidence to success response.
69. Add route reason to success response.
70. Add route audit distribution to readiness receipt.
71. Add route test for every explicit route rule.
72. Add route test for note-based TrustField matching.
73. Add route test for default Noetfield fallback.
74. Add route test for construction precedence.
75. Add route test for friend precedence.
76. Add route test for investor precedence.
77. Add route test for builder precedence.
78. Add route test for trust intent.
79. Add route test for risk value.
80. Add route test for hire intent.
81. Add route test for partner plus capital.
82. Add route test for partner plus talent.
83. Add route test for deal/project/lead values.
84. Add a route-change review checklist.
85. Add route rule owner notes.
86. Add route rule examples in `ROUTING.md`.
87. Add route rule anti-examples in `ROUTING.md`.
88. Add manual route override only after real review need appears.
89. Add learned scoring only after enough labeled outcomes exist.
90. Review routing after first 50 real leads.

## 4. Capture And API Reliability
91. Keep server-side capture as the only write path.
92. Keep Supabase anon key only.
93. Never add service-role key to this app.
94. Keep request IDs on every response.
95. Include request ID in user-facing capture error.
96. Include request ID in server logs.
97. Add structured event for validation failures.
98. Add structured event for rate limit blocks.
99. Add structured event for honeypot blocks.
100. Add structured event for Turnstile failures.
101. Add structured event for Supabase failures.
102. Add structured event for notification failures.
103. Add `capture_attempted` log before persistence.
104. Add `capture_succeeded` log after persistence.
105. Add `capture_failed` log after persistence failure.
106. Add timeout around Supabase insert.
107. Add retry only for transient Supabase network failures.
108. Do not retry validation failures.
109. Do not retry RLS failures.
110. Add safe error mapping for Supabase column mismatch.
111. Add safe error mapping for invalid enum/check constraint.
112. Add safe error mapping for rate limit.
113. Add safe error mapping for Turnstile.
114. Add safe error mapping for network timeout.
115. Add capture latency measurement.
116. Add capture latency threshold alert.
117. Add memory cleanup for old rate-limit buckets.
118. Add local fallback rotation if file grows too large.
119. Add local fallback warning in server logs.
120. Add local fallback export command.

## 5. Notification And Follow-Up
121. Add `NOTIFY_WEBHOOK_URL` when real destination exists.
122. Test webhook with one fake high-priority lead.
123. Confirm medium-priority leads do not send notifications.
124. Confirm low-priority leads do not send notifications.
125. Confirm notification failure does not block capture.
126. Add notification delivery status to logs.
127. Add notification dry-run command to readiness.
128. Add notification payload snapshot test.
129. Keep notification payload minimal.
130. Do not include Supabase keys in notification payload.
131. Do not include IP addresses in notification payload.
132. Do not include browser user agent unless explicitly needed.
133. Include lead ID in notification payload.
134. Include request ID in notification payload.
135. Include route and priority in notification payload.
136. Include contact and raw notes only because follow-up requires them.
137. Add optional redaction mode for raw notes.
138. Add route-specific notification text.
139. Add SourceA notification template.
140. Add BuildMatch notification template.
141. Add Forge notification template.
142. Add Noetfield notification template.
143. Add TrustField notification template.
144. Add Personal notification template.
145. Add daily digest only after live volume starts.
146. Add stale high-priority reminder after manual workflow exists.
147. Add `last_notified_at` only if stored notification history becomes useful.
148. Add notification retry only if webhook destination is reliable.
149. Add webhook secret only if endpoint requires verification.
150. Review notification signal quality after first 20 high-priority leads.

## 6. Wizard UX And Conversion
151. Keep wizard short for v1.
152. Avoid adding dashboard text into the public UI.
153. Keep route preview visible while answering.
154. Keep capture after value has been shown.
155. Make failure state more actionable.
156. Make success state more specific.
157. Show route rule reason after successful capture.
158. Show secondary route after successful capture if useful.
159. Improve mobile spacing on the contact step.
160. Confirm long labels do not wrap awkwardly on small screens.
161. Add focus management when moving wizard steps.
162. Add keyboard arrow navigation for option groups.
163. Add `aria-current` or equivalent for current step.
164. Add reduced-motion handling for transitions.
165. Add visible selected state contrast audit.
166. Add color contrast audit.
167. Add screen-reader label audit.
168. Add field validation hints only when needed.
169. Add contextual placeholder variants by route.
170. Add construction-specific note placeholder.
171. Add investor-specific note placeholder.
172. Add client-specific note placeholder.
173. Add builder-specific note placeholder.
174. Add friend-specific note placeholder.
175. Add TrustField-specific note placeholder.
176. Add optional “not sure” copy without adding a new option.
177. Add “send another signal” after success.
178. Preserve wizard state on accidental refresh.
179. Add local draft save only if abandonment appears high.
180. Review wizard completion after private test.

## 7. Testing And Quality
181. Keep `npm run readiness` as the one command gate.
182. Add readiness output to every receipt.
183. Add `npm run e2e:local` to pre-commit process if hooks are added.
184. Add shared-routing test to prevent preview drift.
185. Add schema drift test to prevent insert failures.
186. Add server-hardening test for 400/413 behavior.
187. Add payload sanitizer test.
188. Add local fallback serialization test.
189. Add malformed JSON test when HTTP test harness exists.
190. Add oversized body test when HTTP test harness exists.
191. Add honeypot HTTP test when HTTP test harness exists.
192. Add rate-limit HTTP test when HTTP test harness exists.
193. Add Turnstile disabled-mode test.
194. Add Turnstile required-mode test with mocked verifier.
195. Add Supabase insert mock test.
196. Add Supabase RLS failure mock test.
197. Add Supabase table-missing mock test.
198. Add notification failure mock test.
199. Add notification success mock test.
200. Add route audit to CI.
201. Add schema drift check to CI.
202. Add syntax check to CI.
203. Add readiness command to CI with external checks skipped.
204. Add live verification as a separate manual job.
205. Add browser screenshot check when browser tooling is available.
206. Add mobile screenshot check.
207. Add accessibility scan when tooling is available.
208. Add no-secret scan.
209. Add `.env` redaction check.
210. Add release checklist test section.

## 8. Security And Privacy
211. Keep service-role key out of `.env`.
212. Keep service-role key out of docs except warnings.
213. Keep anon key as the only Supabase runtime key.
214. Confirm browser bundle never includes Supabase key.
215. Keep insert-only RLS.
216. Never add anon select policy.
217. Never add anon update policy.
218. Never add anon delete policy.
219. Add explicit revoke statements if Supabase grants drift.
220. Add table privilege audit query to docs.
221. Add RLS policy audit query to docs.
222. Add manual key rotation procedure.
223. Add private-test data retention note.
224. Add consent copy review.
225. Add privacy policy before public launch.
226. Add data deletion process before public launch.
227. Add `consent_to_contact` required true before capture.
228. Add separate marketing opt-in only if marketing begins.
229. Keep raw notes length capped.
230. Keep contact length capped.
231. Keep request body size capped.
232. Keep honeypot active.
233. Add Turnstile before public traffic.
234. Add production origin allowlist before public traffic.
235. Add CSP review before public traffic.
236. Add dependency policy if dependencies are introduced.
237. Avoid adding analytics before privacy position is clear.
238. Avoid storing raw IP.
239. Use hashed IP only if abuse monitoring requires it.
240. Review security after first private-test day.

## 9. Operations And Release
241. Commit current readiness/E2E changes after review.
242. Use one clean commit for readiness work.
243. Tag private-test build after Supabase verification passes.
244. Keep deployment out of scope until private-test gate passes.
245. Add deployment plan only after live insert/read-denial passes.
246. Add environment checklist for production.
247. Add production `.env` checklist.
248. Add rollback checklist.
249. Add post-test review checklist.
250. Add private-test issue template.
251. Add lead-review routine for the founder.
252. Add daily private-test note after each test day.
253. Add manual lead-status update process in Supabase table view.
254. Avoid building admin dashboard before real usage.
255. Avoid learned scoring before labeled outcomes.
256. Avoid CRM features before follow-up pain is proven.
257. Add uptime monitor only after deployment.
258. Add capture monitor only after deployment.
259. Add webhook monitor only after notification activation.
260. Add Supabase quota review.
261. Add backup/export routine.
262. Add smoke command for deployed URL.
263. Add `SMOKE_BASE_URL` docs.
264. Add staging project only if changes become risky.
265. Add release notes template.
266. Add change log after first committed version.
267. Add `npm run readiness` to release notes.
268. Add known-skips section to release notes.
269. Add founder manual-action checklist.
270. Run readiness before every test session.

## 10. Strategy And Product Learning
271. Define success metric for private test.
272. Define minimum number of private submissions.
273. Define what counts as high-quality lead.
274. Define what counts as wrong route.
275. Define what counts as low-friction capture.
276. Track how many users complete all steps.
277. Track which route gets most private-test interest.
278. Track which route produces actionable follow-up.
279. Track which route produces confusion.
280. Track which copy creates useful raw notes.
281. Review first 10 leads manually.
282. Review first 25 leads manually.
283. Review first 50 leads manually.
284. Decide if route rules need adjustment after 50 leads.
285. Decide if more fields are hurting completion.
286. Decide if less context produces worse follow-up.
287. Decide if BuildMatch demand is real.
288. Decide if TrustField deserves a stronger route.
289. Decide if SourceA route needs a project qualifier.
290. Decide if Noetfield needs investor-specific fields.
291. Decide if Forge needs skill/availability fields.
292. Decide if Personal route should stay public.
293. Decide if notification noise is too high.
294. Decide if high-priority criteria are too broad.
295. Decide if medium-priority needs follow-up reminders.
296. Decide if admin dashboard is justified by review workload.
297. Decide if scoring is justified by lead volume.
298. Decide if public launch is justified by private-test quality.
299. Write a private-test learning memo.
300. Convert proven learnings into the next locked v2 blueprint.
