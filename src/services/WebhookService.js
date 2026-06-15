const https = require('https');
const crypto = require('crypto');
const db = require('../../config/db');

class WebhookService {
  static async dispatch(action, payload) {
    const webhooks = await db('webhooks')
      .where({ is_active: true })
      .whereRaw('JSON_CONTAINS(actions, ?)', [JSON.stringify(action)]);

    for (const webhook of webhooks) {
      this.send(webhook, action, payload).catch(e =>
        console.error(`[Webhook] Failed to send to ${webhook.url}:`, e.message)
      );
    }
  }

  static async send(webhook, action, payload) {
    const body = JSON.stringify({ action, payload, timestamp: new Date().toISOString() });
    const signature = webhook.secret_key
      ? crypto.createHmac('sha256', webhook.secret_key).update(body).digest('hex')
      : null;

    const url = new URL(webhook.url);
    const options = {
      hostname: url.hostname,
      port:     url.port || (url.protocol === 'https:' ? 443 : 80),
      path:     url.pathname + url.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent':     'CK-Scheduler-Webhook/1.0',
        ...(signature ? { 'X-Webhook-Signature': signature } : {})
      }
    };

    return new Promise((resolve, reject) => {
      const req = (url.protocol === 'https:' ? https : require('http')).request(options, resolve);
      req.on('error', reject);
      req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
      req.write(body);
      req.end();
    });
  }
}

module.exports = WebhookService;
