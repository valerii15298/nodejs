const express = require("express");
const puppeteer = require("puppeteer");
const URL = require('url');

// text_before email - ([\s\S]*)
// email
// text after email - ([\s\S]*)                              |                 email                                            |

// Regex which match one email from text, email such as john@domain.com john[AT]domain.com john[at]domain.com john[At]domain.com, etc . . .
const emailsRegex = /^(?:[\s\S]*[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-])?([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:@|(?:\[[Aa][Tt]]))[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?:[^a-zA-Z0-9-][\s\S]*)?$/gi;

const metrics = { // percentages of impacts different metrics for calculating importance of different emails
    quantity: 1.2, // importance quantity of the same email in web page
    domain: 1.3, // the page`s domain included in email
    mailto: 1.2 // if email sits in link`s href, e. g. <a href="mailto: valerii15298@gmail.com">
}

const keyWords = { // coefficients of impact keywords if email contains them
    'info': 1.1,
    'admin': 1.15,
    'support': 1.05,
    'contact': 1.15
}

// create express application
const app = express();

// use middleware to easy parsing body
app.use(express.urlencoded({extended: true}));

app.post('/', async (req, res) => {
    const url = req.body.url;
    const bestEmail = await crawl(url);
    // console.log(bestEmail);
    res.send(bestEmail);
});

const server = app.listen(8080, 'localhost');


async function crawl(url) {
    //extract domain from url
    const domainName = URL.parse(url).hostname;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let emails = [];

    // check all data that page requests(css, js and other data), convert to text(utf8) and try search email in this data
    page.on('response', async (response) => {
        // get text of response
        const respText = (await response.buffer()).toString('utf8');

        // extract emails from respText and merge to result array
        emails = emails.concat(await findEmailsInText(respText));
    });

    // open web page and wait for navigation to be finished
    await page.goto(url, {waitUntil: "networkidle2"});

    // wait a bit so that the browser finishes executing JavaScript
    await page.waitForTimeout(2 * 1000);

    // extract result html
    let html = await page.content();

    // extract emails from html and merge to result array
    emails = emails.concat(await findEmailsInText(html));

    // find emails after mailto: in links
    let emailsAfterMailTo = await page.evaluate(
        () => {
            let mails = [];
            const links = document.querySelectorAll('a[href^="mailto:"]');
            // get emails and clean them
            links.forEach(link => mails.push(link.href.replace('mailto:%20', '').replace('mailto:', '')));
            return mails;
        }
    );

    // console.log(emails);

    // result object of emails and metrics for each one
    let emailsWithScores = {};

    if (emails.length === 0)
        return "Emails on page not found!";

    // extract only unique emails from array
    const uniqEmails = Array.from(new Set(emails));

    // iterate ove unique emails and calculate scores for each one
    for (let email of uniqEmails) {
        let coefficient = 1;

        // keywords scores
        for (let keyWord in keyWords) {
            if (email.includes(keyWord))
                coefficient *= keyWords[keyWord];
        }

        // quantity score
        let quantity = emails.filter(x => x === email).length;
        coefficient *= quantity * metrics.quantity;

        // domain score
        if (email.includes(domainName))
            coefficient *= metrics.domain;

        // after mailto score
        if (emailsAfterMailTo.includes(email))
            coefficient *= metrics.mailto;

        emailsWithScores[email] = coefficient;
    }

    let resultEmail = uniqEmails[0];

    console.log("Emails with scores:", emailsWithScores);

    // find email with highest score
    for (let email in emailsWithScores)
        if (emailsWithScores[email] > emailsWithScores[resultEmail])
            resultEmail = email;

    await browser.close();
    return resultEmail;
}


async function findEmailsInText(text) {
    let emails = [];
    let email;
    // check email in text while it exists then append to emails and delete from text
    while ((email = [...text.matchAll(emailsRegex)])[0]) {
        email = email[0][1];
        emails.push(email.replace(/\[[Aa][Tt]]/, '@'));
        text = text.replace(email, '');
    }
    return emails;
}
