const
    puppeteer = require('puppeteer'),
    http = require('http'),
    fetch = require("node-fetch"),
    fs = require('fs'),
    path = require('path');

const {exec} = require('child_process');

let currentMlaId = process.argv[2]; // get command line argument
let token, mlaPort = 45000, headers = {"accept": "application/json", "Content-Type": "application/json"};
let actions = [];
let log = fs.createWriteStream("log.txt", {flags: 'a'});
let mlaFails = fs.createWriteStream("mlafails.txt", {flags: 'a'});
let desc = fs.createWriteStream("desc.txt", {flags: 'a'});

/* TODO Choose multilogin account from which export profiles */
token = "confident_info"; // confident_info
// token = 'confident_info'; // confident_info


function chooseProxyPass(profileName) {
    /* TODO Choose method for proxy password
        return proxy password by profile name */
    let list = {
        'Anna': '79wi6lde6bc4',
        'Salva': 'ou3gru3kgd0q',
        'Alex': '79wi6lde6bc4',
        'Anat': 'surf'
    };
    // let provider = profileName.match(/\(([^)]+)\)/)[1];
    // if (provider)
    //     return list[provider];
    return 'surf';
}

async function startProfile(profileId) {
    /*Send GET request to start the browser profile by profileId.
    Returns web socket as response which should be passed to puppeteer.connect*/
    http.get(`http://127.0.0.1:${mlaPort}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`, (resp) => {
        let data = '';
        let ws = '';

        //Receive response data by chunks
        resp.on('data', (chunk) => {
            data += chunk;
        });

        /*The whole response data has been received. Handling JSON Parse errors,
        verifying if ws is an object and contains the 'value' parameter.*/
        resp.on('end', () => {
            let ws;
            try {
                ws = JSON.parse(data);
            } catch (err) {
                console.log(err);
            }
            if (typeof ws === 'object' && ws.hasOwnProperty('value')) {
                console.log(`Browser websocket endpoint: ${ws.value}`);
                run(ws.value, profileId);
            }
        });

    }).on("error", (err) => {
        desc.write(profileId + "\t" + err.message + "\n");
        mlaFails.write(profileId + "\n");
    });
}

async function run(ws, profileId) {
    try {
        //Connecting Puppeteer with Mimic instance and performing simple automation.
        let browser = await puppeteer.connect({browserWSEndpoint: ws, defaultViewport: null});
        let page = await browser.newPage();

        for (let i = 0; i < actions.length; ++i) {
            await actions[i](page, profileId);
        }

        // await page.screenshot({ path: `/home/${process.env.USER}/Desktop/multiloginScreenshot.png` });
        await browser.close();
    } catch (err) {
        desc.write(profileId + "\t" + err.message + "\n");
        mlaFails.write(profileId + "\n");
    }
}

async function exportPasswords(page, profileId) {
    await page.goto('chrome://settings/passwords');
    page.on("console", msg => console.log(msg._text));

    let resp = await page.evaluate(async () => {
        let items = [['name', 'url', 'username', 'password']];
        const countPasswords = document.querySelector("body > settings-ui").shadowRoot.querySelector("#main").shadowRoot.querySelector("settings-basic-page").shadowRoot.querySelector("#basicPage > settings-section.expanded > settings-autofill-page").shadowRoot.querySelector("#passwordSection").shadowRoot.querySelector("#passwordList").childNodes.length;
        for (let i = 2; i <= countPasswords; ++i) {
            let item = document.querySelector("body > settings-ui").shadowRoot.querySelector("#main").shadowRoot.querySelector("settings-basic-page").shadowRoot.querySelector("#basicPage > settings-section.expanded > settings-autofill-page").shadowRoot.querySelector("#passwordSection").shadowRoot.querySelector(`#passwordList > password-list-item:nth-child(${i})`).shadowRoot;
            item.querySelector("#showPasswordButton").shadowRoot.querySelector("#icon").click();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            let password = item.querySelector("#password").value;
            let url = item.querySelector("#originUrl").href;
            let name = url.split('/')[2];
            let username = item.querySelector("#username").value;
            items.push([name, url, username, password]);
        }
        return items;
    });

    let csvStr = '';
    resp.forEach(function (row) {
        csvStr += row.join(",") + "\n";
    });
    fs.writeFileSync(`passwords/${profileId}.csv`, csvStr);
}

async function exportCookies(page, profileId) {
    const client = await page.target().createCDPSession();
    const all_browser_cookies = (await client.send('Network.getAllCookies')).cookies;
    fs.writeFileSync(`dyisy_cookies/${profileId}`, JSON.stringify(all_browser_cookies));
}

function copyProfile(profileId) {
    // Get profile data from MLA 4
    return fetch(`https://api.multiloginapp.com/v1/profile/get-data?token=${token}&profileId=${profileId}`, {
        method: 'GET',
        headers: headers
    })
        .then(resp => resp.json())
        .then(profileData => cloneProfile(profileData))
        .then(newProfile => {
            importCookiePasswords(profileId, newProfile.uuid);
        });
}

function cloneProfile(profileData) {
    let p = profileData;
    let password = chooseProxyPass(p.name);

    // fs.copyFile(`passwords/${p.id}.csv`, `passwords/${p.name}(${p.id}).csv`, (error) => {
    //     if (error) log.write(error);
    // });

    if (p.browserType !== 'mimic') {
        desc.write(p.name + ' ' + p.sid + " not mimic type\n");
        mlaFails.write(p.sid + "\n");
        process.exit(1);
    }

    // Properties from MLA 4 structure to MLA 5 structure
    let new_profile = {
        "name": p.name,
        "os": "win",
        "browser": p.browserType,
        "network": {
            "proxy": {
                "type": p.proxyType.toUpperCase(),
                "host": p.proxyHost,
                "port": p.proxyPort,
                "username": p.proxyUser,
                "password": password
            }
        },
        "navigator": {
            "userAgent": p.userAgent,
            "platform": p.platform,
            "doNotTrack": p.doNotTrack,
            "hardwareConcurrency": p.hardwareConcurrency,
            "language": p.langHdrs
        },
        "storage": {
            "local": true,
            "extensions": true,
            "bookmarks": true,
            "history": true,
            "passwords": true
        },
        "webRTC": {
            "mode": p.webRtc.type.toUpperCase(),
            "fillBasedOnExternalIp": p.webRtc.fillOnStart,
            "localIps": p.webRtc.localIps
        },
        "plugins": {
            "enableVulnerable": !p.disablePlugins,
            "enableFlash": !p.disableFlashPlugin
        },
    }

    return fetch(`http://localhost:${mlaPort}/api/v2/profile`, { // Create profile in MLA 5 and return new profile info
        method: 'POST',
        headers: headers,
        body: JSON.stringify(new_profile),
    })
        .then(resp => resp.json());
}

function importCookiePasswords(oldProfile, newProfile) {
    fs.readFile(`dyisy_cookies/${oldProfile}`, 'utf-8', (err, data) => {
        fetch(`http://localhost:${mlaPort}/api/v1/profile/cookies/import/webext?profileId=${newProfile}`, {
            method: 'POST',
            headers: headers,
            body: data,
        }).then(resp => resp.text()).then(data => {
            log.write(`${oldProfile}\t${newProfile}\t${data}\n`);
            fs.copyFileSync(`/home/valerii/PhpstormProjects/nodejs/passwords/${oldProfile}.csv`, '/home/valerii/Documents/pass.csv');
            actions.push(importPasswords); // add action importPasswords
            startProfile(newProfile); // Start profile in puppeter and execute actions
        });
    });
}

async function importPasswords(page) {
    await page.goto('chrome://settings/passwords');

    await new Promise(function (resolve) {
        setTimeout(resolve, 1000)
    });

    await page.evaluateHandle(`document.querySelector("body > settings-ui").shadowRoot.querySelector("#main").shadowRoot.querySelector("settings-basic-page").shadowRoot.querySelector("#basicPage > settings-section.expanded > settings-autofill-page").shadowRoot.querySelector("#passwordSection").shadowRoot.querySelector("#menuImportPassword").click()`);

    await new Promise(function (resolve) {
        setTimeout(resolve, 1000)
    });

    exec('xdotool key \'0xff54\'');
    await new Promise(function (resolve) {
        setTimeout(resolve, 1000)
    });
    exec('xdotool key \'0xff0d\'');

    await new Promise(function (resolve) {
        setTimeout(resolve, 2000);
    });
}

if (process.argv[3] === 'export') {
    actions.push(exportCookies);
    actions.push(exportPasswords); // Uncomment theese 3 lines for export cookies and passwords from 1 testing MLA 4 account
    startProfile(currentMlaId).catch(er => log.write(er));
}

if (process.argv[3] === 'import') {
    copyProfile(currentMlaId);
}


/*
*                                       Instruction
* Install nodejs
* create some directory(mladir for example), copy this file to your directory and switch to your directory in terminal
*confident_info */


// async function mla4Profiles(count) {
//     return fetch(`https://api.multiloginapp.com/v1/profile/list?token=${token}`, {
//         method: 'GET',
//         headers: headers
//     }).then(resp => resp.json().then(async (json) => {
//         let data = json.data;
//         if (count) {
//             data = json.data.slice(0, count);
//         } else
//             data = data.filter(e => testProfiles.includes(e.sid));
//         console.log(data.length + "\n");
//
//         for (let profile of data) {
//             if (profile.browserName === 'mimic') {
//                 await startProfile(profile.sid);
//                 console.log(profile.sid + " started\n");
//             } else {
//                 console.log("Not mimic\n");
//             }
//         }
//         // data.forEach((profile) => {
//         //     if (profile.browserName === 'mimic') {
//         //         startProfile(profile.sid);
//         //         console.log(profile.sid + " started\n");
//         //     } else {
//         //         console.log("Not mimic\n");
//         //     }
//         // });
//     }));
// }

// function copyProfiles() {
//     fs.readdir('dyisy_cookies', (err, files) => {
//         files.forEach(profileId => copyProfile(profileId));
//     });
// }