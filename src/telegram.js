/**
 * Telegram ops delivery for @Gateway_A only.
 */

const TELEGRAM_RETRY_DELAYS_MS = [500, 1500];

export function telegramConfigured(env = {}) {
  const token = env.TELEGRAM_BOT_TOKEN || "";
  const chatId = env.TELEGRAM_ALERT_CHAT_ID || env.TELEGRAM_ALLOWED_CHAT_ID || env.TELEGRAM_OPS_CHAT_ID || "";
  return Boolean(token && chatId);
}

export function telegramChatId(env = {}) {
  return env.TELEGRAM_ALERT_CHAT_ID || env.TELEGRAM_ALLOWED_CHAT_ID || env.TELEGRAM_OPS_CHAT_ID || "";
}

async function postTelegramMessage(env, body, { fetchImpl = fetch } = {}) {
  const token = env.TELEGRAM_BOT_TOKEN || "";
  if (!token) {
    return { ok: false, skipped: true, reason: "telegram_not_configured" };
  }

  let lastResult = { ok: false, status: 0, error: "telegram_request_failed" };
  for (let attempt = 0; attempt <= TELEGRAM_RETRY_DELAYS_MS.length; attempt += 1) {
    const resp = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let payload = {};
    try {
      payload = await resp.json();
    } catch {
      payload = {};
    }
    lastResult = {
      ok: Boolean(payload.ok),
      message_id: payload.result?.message_id || null,
      status: resp.status,
      error: payload.ok ? null : JSON.stringify(payload).slice(0, 200),
    };
    if (lastResult.ok) return lastResult;
    if (resp.status !== 429 || attempt >= TELEGRAM_RETRY_DELAYS_MS.length) break;
    await new Promise((resolve) => setTimeout(resolve, TELEGRAM_RETRY_DELAYS_MS[attempt]));
  }
  return lastResult;
}

export async function sendTelegramAlert(env, text, options = {}) {
  const chatId = telegramChatId(env);
  if (!chatId) {
    return { ok: false, skipped: true, reason: "telegram_not_configured" };
  }
  return postTelegramMessage(
    env,
    {
      chat_id: chatId,
      text: String(text).slice(0, 3900),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    },
    options,
  );
}

export async function sendTelegramMessage(env, chatId, text, options = {}) {
  if (!chatId) {
    return { ok: false, skipped: true, reason: "telegram_not_configured" };
  }
  return postTelegramMessage(
    env,
    {
      chat_id: chatId,
      text: String(text).slice(0, 3900),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    },
    options,
  );
}
