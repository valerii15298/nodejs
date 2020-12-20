const fetch = require('node-fetch');

// returns "ok" if success
async function sendSlackNotification(webHookUrl, notificationMessage) {
    return fetch(webHookUrl, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: `{"text":"${notificationMessage}"}`
    }).then(resp => resp.text());
}

// sendSlackNotification('https://hooks.slack.com/services/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', 'Hi, rrr');

