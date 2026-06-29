# Sina Gateway: 300 Upgrade Plans

## Phase 1: Launch Hardening
1. Add a visible success state that confirms the visitor's route and next step.
2. Add a graceful failure state when Supabase capture is unavailable.
3. Add a local fallback warning so test leads are not confused with live leads.
4. Add Turnstile or another bot check before public launch.
5. Rate-limit `/api/leads` by IP and time window.
6. Add request-size limits for all API endpoints.
7. Add stricter contact validation for obvious junk submissions.
8. Add hidden honeypot field for simple spam filtering.
9. Add server-side origin checks for production domains.
10. Add deployment environment validation on server start.
11. Add a `/ready` endpoint that checks Supabase connectivity.
12. Add structured server logs for each capture attempt.
13. Add safe error IDs for failed captures.
14. Add a test mode flag that marks fake leads clearly.
15. Add a cleanup script for local test lead data.
16. Add a production checklist to `SETUP.md`.
17. Add a launch rollback checklist.
18. Add a version banner in server logs.
19. Add a no-index meta tag until launch.
20. Add Open Graph metadata for launch sharing.
21. Add favicon and touch icons.
22. Add robots.txt with launch-ready rules.
23. Add a security.txt contact file.
24. Add CSP headers for the static app.
25. Add Referrer-Policy and Permissions-Policy headers.
26. Add schema cache troubleshooting docs for Supabase.
27. Add a script to verify required env vars.
28. Add a script to verify RLS insert-only behavior.
29. Add a script to test all route/tag combinations.
30. Add a final smoke-test command that runs all checks.

## Phase 2: Data Model
31. Split `contact` into `email`, `phone`, `social`, and `preferred_contact`.
32. Add `company` for client, investor, and partner leads.
33. Add `role_title` for business context.
34. Add `city` and `country` fields.
35. Add `timezone` from browser when available.
36. Add `budget_range` for client/project leads.
37. Add `capital_range` for investor leads.
38. Add `project_type` for construction leads.
39. Add `trade_type` for BuildMatch leads.
40. Add `collaboration_type` for builders.
41. Add `intro_source` for referrals.
42. Add `relationship_context` for friend/network leads.
43. Add `consent_to_contact` boolean.
44. Add `marketing_opt_in` boolean.
45. Add `ip_hash` instead of raw IP for abuse patterns.
46. Add `user_agent_summary` for debugging.
47. Add `session_id` for multi-step analysis.
48. Add `visitor_id` anonymous cookie.
49. Add `submission_id` public-safe tracking code.
50. Add `capture_version` for schema evolution.
51. Add `route_reason` explaining deterministic routing.
52. Add `priority_reason` explaining deterministic priority.
53. Add `tags` text array for flexible labels.
54. Add `status` with new, reviewed, contacted, closed.
55. Add `owner` for who follows up.
56. Add `next_action_at` for follow-up timing.
57. Add `last_contacted_at`.
58. Add `archived_at`.
59. Add `duplicate_of` for lead deduplication.
60. Add migrations folder with timestamped SQL changes.

## Phase 3: Routing Intelligence
61. Convert route logic into a JSON routing matrix.
62. Add tests for every identity-intent-value combination.
63. Add route tie-breaker rules.
64. Add `TrustField` as an explicit intent option.
65. Add a governance/risk question when notes mention trust.
66. Add a construction-specific branch after identity selection.
67. Add an investor-specific branch for thesis and check size.
68. Add a client-specific branch for workflow and pain.
69. Add a builder-specific branch for skills and availability.
70. Add a friend-specific branch for memory/context.
71. Add multi-route recommendations when signals overlap.
72. Add primary and secondary venture routes.
73. Add confidence level for deterministic route.
74. Add a route preview explanation in the UI.
75. Add a manual override field for admin review.
76. Add “not sure” option that routes to Noetfield.
77. Add route-specific follow-up prompts.
78. Add route-specific confirmation copy.
79. Add route-specific CTA after capture.
80. Add route-specific email notification templates.
81. Add route analytics counters.
82. Add route drift review after 50 leads.
83. Add a route audit report command.
84. Add weighted rules only after enough rows exist.
85. Add learned scoring as a separate service, not v1 core.
86. Add a route sandbox for testing new rules.
87. Add route change history.
88. Add route config validation.
89. Add route config docs.
90. Add fallback route monitoring.

## Phase 4: UX And Conversion
91. Add keyboard navigation through wizard options.
92. Add accessible focus states for every control.
93. Add progress labels for screen readers.
94. Add reduced-motion support.
95. Add mobile thumb-friendly spacing pass.
96. Add route-specific color accents.
97. Add route-specific microcopy.
98. Add animated transition between wizard steps.
99. Add back/forward preservation in browser history.
100. Add save-and-resume via local storage.
101. Add “send another signal” after success.
102. Add prefilled query params for campaigns.
103. Add QR-code-friendly source mode.
104. Add friend/referral quick mode.
105. Add high-intent fast path.
106. Add optional notes earlier for complex visitors.
107. Add clearer BuildMatch “early access” language.
108. Add trust/compliance language for TrustField.
109. Add direct SourceA examples for clients.
110. Add investor thesis examples for Noetfield.
111. Add builder collaboration examples for Forge.
112. Add first-screen visual asset.
113. Add subtle route map visualization.
114. Add better empty states.
115. Add better loading state during capture.
116. Add copy A/B variants.
117. Add conversion event tracking.
118. Add scroll-depth tracking.
119. Add abandonment tracking by wizard step.
120. Add weekly UX review from real behavior.

## Phase 5: Notifications And Follow-Up
121. Send email notification for high-priority leads.
122. Send SMS notification for urgent leads.
123. Send Slack or Discord webhook for all captures.
124. Add daily digest email.
125. Add weekly strategy digest.
126. Add route-specific digest sections.
127. Add “reply directly” email formatting.
128. Add calendar link generation for high-priority leads.
129. Add Gmail draft creation.
130. Add contact card export.
131. Add CSV export script.
132. Add Airtable sync option.
133. Add Notion sync option.
134. Add Google Sheets sync option.
135. Add follow-up checklist per route.
136. Add status change notifications.
137. Add reminder if high-priority lead is not contacted.
138. Add stale lead alert after 72 hours.
139. Add “contacted” update endpoint.
140. Add manual note-taking endpoint.
141. Add route owner assignment.
142. Add lead handoff email.
143. Add intro/referral response template.
144. Add investor response template.
145. Add client discovery response template.
146. Add builder collaboration response template.
147. Add construction lead response template.
148. Add friend/network response template.
149. Add unsubscribe/suppression handling.
150. Add follow-up performance tracking.

## Phase 6: Admin And Review
151. Build a minimal protected admin view.
152. Use magic link login for admin access.
153. Show leads by newest first.
154. Filter by priority.
155. Filter by venture route.
156. Filter by lead type.
157. Filter by urgency.
158. Search by name/contact/company.
159. Add lead detail drawer.
160. Add status update controls.
161. Add owner assignment controls.
162. Add internal notes.
163. Add duplicate marking.
164. Add archive button.
165. Add CSV download.
166. Add route distribution chart.
167. Add priority distribution chart.
168. Add weekly lead volume chart.
169. Add campaign/source breakdown.
170. Add conversion funnel by wizard step.
171. Add high-priority queue.
172. Add missed-follow-up queue.
173. Add construction-only view.
174. Add investor-only view.
175. Add SourceA client view.
176. Add Forge collaborator view.
177. Add TrustField signal view.
178. Add Noetfield strategy view.
179. Add audit log for admin actions.
180. Add admin read-only mode.

## Phase 7: Security And Privacy
181. Keep service-role key out of all runtime paths.
182. Add automated secret scanning.
183. Add pre-commit secret checks.
184. Add dependency vulnerability checks if dependencies are added.
185. Add strict CORS allowlist in production.
186. Add bot rate-limit by IP hash.
187. Add bot rate-limit by contact fingerprint.
188. Add submission cooldown per browser session.
189. Add disposable email detection.
190. Add abusive content detection.
191. Add data retention policy.
192. Add lead deletion process.
193. Add export-my-data process if needed.
194. Add privacy policy page.
195. Add consent language near contact submit.
196. Add audit of fields containing personal data.
197. Add PII minimization review.
198. Add encrypted-at-rest note for Supabase docs.
199. Add admin access review checklist.
200. Add RLS regression test in CI.
201. Add anon-read-denial test to deploy pipeline.
202. Add RLS policy comments in SQL.
203. Add table grants review.
204. Add schema exposure review.
205. Add SQL migration review process.
206. Add production incident playbook.
207. Add key rotation playbook.
208. Add Supabase project backup plan.
209. Add logging privacy filter.
210. Add secure launch signoff.

## Phase 8: Deployment And Operations
211. Deploy to Cloudflare Pages or Workers.
212. Deploy to Vercel as a simple Node/static app.
213. Add production environment variables.
214. Add preview environment variables.
215. Add staging Supabase project.
216. Add production Supabase project.
217. Add domain mapping.
218. Add HTTPS verification.
219. Add uptime monitor.
220. Add capture endpoint monitor.
221. Add Supabase insert monitor.
222. Add alert on capture failure spike.
223. Add alert on zero leads after traffic.
224. Add basic analytics.
225. Add deployment README.
226. Add deploy smoke test.
227. Add rollback command docs.
228. Add environment drift checklist.
229. Add build artifact review.
230. Add serverless adapter if needed.
231. Add Dockerfile only if deployment requires it.
232. Add Git initialization.
233. Add first clean commit.
234. Add release tags.
235. Add changelog.
236. Add production branch policy.
237. Add CI test workflow.
238. Add CI syntax check workflow.
239. Add CI Supabase verifier against staging.
240. Add monthly operational review.

## Phase 9: Analytics And Strategy
241. Track total submissions.
242. Track completion rate.
243. Track abandonment by step.
244. Track route distribution.
245. Track priority distribution.
246. Track urgency distribution.
247. Track source/campaign performance.
248. Track high-priority lead response time.
249. Track route-to-business outcome.
250. Track repeat visitor behavior.
251. Track construction demand patterns.
252. Track investor thesis patterns.
253. Track client pain patterns.
254. Track collaborator skill patterns.
255. Track friend/referral network patterns.
256. Build monthly gateway memo.
257. Build top-opportunity report.
258. Build missed-opportunity report.
259. Build venture demand heatmap.
260. Build BuildMatch validation report.
261. Build SourceA demand report.
262. Build Noetfield investor report.
263. Build Forge collaborator report.
264. Build TrustField signal report.
265. Add manual outcome labels.
266. Add lead quality review score after contact.
267. Add conversion-to-meeting metric.
268. Add conversion-to-deal metric.
269. Add revenue attribution field.
270. Add data-informed scoring after 100 rows.

## Phase 10: Expansion And Moat
271. Add public route pages for each venture.
272. Add SourceA-specific landing path.
273. Add BuildMatch waitlist page.
274. Add Forge collaborator intake page.
275. Add Noetfield investor memo page.
276. Add TrustField trust/compliance page.
277. Add personal network route page.
278. Add shareable referral links.
279. Add partner-specific intake links.
280. Add QR codes for events and in-person meetings.
281. Add private “Sina met you here” source codes.
282. Add voice-note intake option.
283. Add file upload for project briefs.
284. Add calendar booking after high-priority capture.
285. Add AI summary of raw notes after capture.
286. Add AI deduplication suggestions.
287. Add AI follow-up draft generation.
288. Add AI route-review assistant for admin only.
289. Add vector search across lead notes.
290. Add cross-venture matching suggestions.
291. Add referral graph.
292. Add opportunity graph.
293. Add capital/talent/project marketplace map.
294. Add private investor update generator.
295. Add BuildMatch early supply/demand matching.
296. Add SourceA project qualification flow.
297. Add Forge builder bench.
298. Add Noetfield strategic pipeline.
299. Add TrustField risk-intake productization.
300. Turn Gateway into the central opportunity operating system.
