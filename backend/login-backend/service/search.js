const util = require('../utils/util');
const auth = require('../utils/auth');

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';

async function search(queryParameters) {

    var queryString = queryParameters;
    // TODO: Load the search parameters string and split by & and =
    var key = "";
    var value = "";
    for (var k in queryString) {
        key = k;
        value = queryParameters[k];
    }
    console.log("Received params are\n");
    console.log(key);
    console.log(value);
    // TODO: Call the dynamodb to display appropriate users
    const params = {
        TableName: userTable,
        Key: {
            username: value
        }
    }
    return await dynamodb.get(params).promise().then(res => {
        console.log("Item received from dynamo is");
        console.log(res.Item);
        return util.buildResponse(200, res.Item);
    }, error => {
        console.error('There is an error', error);
    })
}
module.exports.search = search