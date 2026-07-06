export async function verifyTurnstileToken({ token, secret, ip, fetchImpl = fetch }) {
  if (!secret) return "";
  if (!token) return "Bot check is required";

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  const response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await response.json();
  return result.success ? "" : "Bot check failed";
}
