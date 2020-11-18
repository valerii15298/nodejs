// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');

GOOGLE_APPLICATION_CREDENTIALS='/home/user/PhpstormProjects/working/api-gmail/service.json';
const {GoogleAuth} = require('google-auth-library');

/**
 * Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
 * this library will automatically choose the right client based on the environment.
 */
async function main() {
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
    const res = await client.request({ url });
    console.log(res.data);
}

main().catch(console.error);

// const {JWT} = require('google-auth-library');
// const keys = require('./service.json');
//
// async function main() {
//     const client = new JWT(
//         keys.client_email,
//         null,
//         keys.private_key,
//         ['https://www.googleapis.com/auth/cloud-platform'],
//     );
//     const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
//     const res = await client.request({url});
//     console.log(res.data);
// }
//
// main().catch(console.error);

// var jwtClient = new google.auth.JWT(
//     "valerii15298@valerii15298-273016.iam.gserviceaccount.com",
//     "service.json",
//     "-----BEGIN PRIVATE KEY-----\nconfident_info\n",
//     ['https://mail.google.com/',
//         'https://www.googleapis.com/auth/gmail.readonly',
//         'https://www.googleapis.com/auth/gmail.modify',
//         'https://www.googleapis.com/auth/gmail.metadata'], // I have also tried https://www.googleapis.com/auth/gmail.imap_admin
//     'valerii15298@gmail.com' // use a user email in your domain since service account do not have Gmail box
// );

// jwtClient.authorize(function (err, tokens) {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log(tokens); // successful print the token
// });

console.log("END");
return 2;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.list({
        auth: auth,
        userId: 'me',
        maxResults: 1
    }, function (err, response) {
        console.log(response);
        console.log(err);
        // let messageID = response.data.messages;
        // gmail.users.messages.get({
        //     auth: auth,
        //     userId: 'me',
        //     id: messageID[0].id
        // }, function (err, response) {
        //     console.log(response);
        //     messageID.splice(0, 1);
        //     if (messageID.length > 0)
        //         printMessage(messageID, auth);
        //     else {
        //         console.log("All Done");
        //     }
        // });
    });
}
