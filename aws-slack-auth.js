// Authorize slack notifications for user

const fetch = require('node-fetch');

// Save data for user
async function saveWebhookUrl(webhookUrl, state) {
    return new Promise((resolve, reject) => {
        const AWS = require("aws-sdk");
        AWS.config.update({
            region: "us-east-1",
        });

        const docClient = new AWS.DynamoDB.DocumentClient();

        const params = {
            TableName: "perrfyUsers",
            Item: {
                "id": Math.random().toString(),
                webhookUrl,
                state
            }
        };

        docClient.put(params, async (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });
}


exports.handler = async (event) => {
    const code = event.queryStringParameters.code;
    const state = event.queryStringParameters.state;
    const options = {
        method: 'POST',
        headers: {'Content-type': 'application/x-www-form-urlencoded'},
        body: `code=${code}&client_id=1595392795092.1601861577617&client_secret=3d8b5ae5ee27e5ab23f46c4728168c56`,
    };

    const respJson = await fetch('https://slack.com/api/oauth.v2.access', options).then(resp => resp.json());
    const webhookUrl = respJson.incoming_webhook.url;
    await saveWebhookUrl(webhookUrl, state);
    return JSON.stringify({webhookUrl, state});
};

// exports.handler().then(console.log);


