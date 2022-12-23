const util = require('../utils/util');
const auth = require('../utils/auth');
const AWS = require('aws-sdk');
async function home(userDetails) {
  // TODO: Call another lambda function - recommendations
  // Set the region
  AWS.config.update({ region: 'us-east-1' });


  // Create an Lambda client
  const lambda = new AWS.Lambda();

  // Set the parameters for the invoke request
  console.log(userDetails)
  const params = {
    FunctionName: 'recommendations',
    Payload: JSON.stringify(userDetails) // optional input payload for the function
  };
  console.log('params', params);

  var message_received = "";
  console.log("im here");
  // Invoke the function
  // var response = await lambda.invoke(params, function(err, data) {
  //     console.log("In callback");
  //     if (err) {
  //         console.log("error is");
  //         console.log(err);
  //         message_received = err;
  //     } else {
  //         var temp = JSON.parse(data);
  //         console.log("response is***");
  //         console.log(temp);
  //         console.log('message received is',response.response.httpResponse);
  //         message_received = temp['httpResponse'];
  //         return util.buildResponse(200, message_received);

  //     }


  // });

  lambda.invoke(params, function (err, data) {
    if (err) {
      console.error('the error is', err);
    }
    else {
      console.log(data);
    }
  });

}

module.exports.home = home;