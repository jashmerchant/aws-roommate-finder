const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';
const util = require('../utils/util')

async function edituser(userInfo) {
    // const info = {
    //    "sender": "jash",
    //    "receiver": "sanchi",
    //    "isAccepted": false
    // }

    const receiver = await getUser(userInfo.receiver.toLowerCase().trim());
    const sender = await getUser(userInfo.sender.toLowerCase().trim());
  
        // If Accept or Reject button is clicked
        receiver.friendList = receiver.friendList.filter((friend)=>friend.name !== sender.username)
        sender.friendList = sender.friendList.filter((friend)=>friend.name !== receiver.username)

        receiver.friendList.push({ "name": sender.username, "request": userInfo.request, "status": "received" })
        sender.friendList.push({ "name": receiver.username, "request": userInfo.request, "status": "sent" })
    
    // const saveSenderResponse = await saveUser(sender, receiver, userInfo.isAccepted, "sent");
    // const saveReceiverResponse = await saveUser(receiver, sender, userInfo.isAccepted, "received");
    const saveReceiverResponse = await saveUser(receiver);
    const saveSenderResponse = await saveUser(sender);
    if (!saveReceiverResponse || !saveSenderResponse) {
        return util.buildResponse(503, {
            message: 'Server Error'
        })
    }
    const params = {
        TableName: userTable
    };

    var scanResults = [];
    
    var items = undefined;
    
    do {
        items = await dynamodb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");
    

    return util.buildResponse(200, scanResults);
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    return await dynamodb.get(params).promise().then(res => {
        return res.Item;
    }, error => {
        console.error('There is an error', error);
    })
}

async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.log('There is an error saving user: ', error)
    });
}


// async function saveUser(receiver, sender, isAccepted, status) {
//     const params = {
//         TableName: userTable,
//         Item: receiver,
//         Key: {
//             "username": receiver.username
//         },
//         UpdateExpression: "SET #attrName = list_append(#attrName, :attrValue)",
//         ExpressionAttributeNames: {
//             "#attrName": "friendList"
//         },
//         ExpressionAttributeValues: {
//             ":attrValue": [{ "name": sender.username, "isAccepted": isAccepted, "status": status }]
//         },
//         ReturnValues: "UPDATED_NEW"
//     }


//     // docClient.update(params, function (err, data) {
//     //     if (err) console.log(err);
//     //     else console.log(data);
//     // });

//     dynamodb.update(params, function (err, data) {
//         if (err) {
//             console.log(err);
//             // callback(err);
//         } else {
//             console.log(data);
//             // callback(null, data);
//         }
//     });
// }

module.exports.edituser = edituser;