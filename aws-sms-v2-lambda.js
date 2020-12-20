var AWS = require('aws-sdk')
var SNS = new AWS.SNS()

var params = {
    PhoneNumber: '+123456789012',
    Message: 'SMS from Lambda!'
}

exports.handler = async (event) => {
    return new Promise(function(resolve, reject) {
        SNS.publish(params, function(err, data) {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                console.log(data)
                resolve(data)
            }
        })
    })
}
