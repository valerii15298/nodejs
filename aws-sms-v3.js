async function sendSMS(phoneNumber, Message) {
    return new Promise((resolve, reject) => {
        const {SNSClient, PublishCommand, SNS} = require("@aws-sdk/client-sns");
        const regionObj = {region: "us-east-1"};

        const sendMessageParams = {
            Message,
            PhoneNumber: phoneNumber,
            MessageAttributes: {
                "AWS.SNS.SMS.SenderID": {
                    DataType: "String",
                    StringValue: "Vadlerka"
                },
            },
        };

        const snsClient = new SNSClient(regionObj);
        const sns = new SNS(regionObj);


        sns.checkIfPhoneNumberIsOptedOut({phoneNumber}, async (err, data) => {
            if (err) reject(err);
            if (data.isOptedOut)
                sns.optInPhoneNumber({phoneNumber}, async function (err, data) {
                    if (err) reject(err);
                    console.log('block');
                    resolve(await snsClient.send(new PublishCommand(sendMessageParams)).catch(reject));
                });
            else
                resolve(await snsClient.send(new PublishCommand(sendMessageParams)).catch(reject));
        });
    });
}

sendSMS("+380509501469", 'This is a text message').then(console.log);

// "+380509501469"
