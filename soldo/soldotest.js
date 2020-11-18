const fetch = require("node-fetch");
const {exec} = require("child_process");
let url = 'https://api.soldo.com/business/v2/cards';

let token = process.argv[2];
let page = process.argv[3];
page = 1;
token = 'confident_info'

const getCard = async card_id => {
    try {
        const response = await fetch(url + "/" + card_id + "?showSensitiveData=true", {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const card = await response.text();
        console.log(card);

        // await exec(`java -cp bcprov-ext-jdk15on-165.jar CryptographyExample.java '${card["sensitive_data"]["encrypted_cvv"]}'`, (error, stdout, stderr) => {
        //     if (error || stderr) {
        //         console.log("Error!");
        //         return;
        //     }
        //     console.log(card.name + "\t" + stdout.trim());
        // });
    } catch (error) {
        console.log(error);
    }
};

const getData = async url => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        let cards = await response.json();
        // cards = cards['results'];
        cards = cards['results'];
        // console.log(cards);
        Object.values(cards).forEach(card => {
            getCard(card.id);
        });
    } catch (error) {
        console.log(error);
    }
};

getData(url);
