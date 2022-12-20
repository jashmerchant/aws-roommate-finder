const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';
const util = require('../utils/util')
const bcrypt = require('bcryptjs');

async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    const age = userInfo.age;
    const sex = userInfo.sex;
    const orientation = userInfo.orientation;
    const diet = userInfo.diet;
    const drinks = userInfo.drinks;
    const drugs = userInfo.drugs;
    const education = userInfo.education;
    const ethnicity = userInfo.ethnicity;
    const income = userInfo.income;
    const location = userInfo.location;
    const pets = userInfo.pets;
    const smokes = userInfo.smokes;
    const speaks = userInfo.speaks;
    if (!username || !name || !email || !password || !age || !sex || !orientation || !diet || !drinks || !drugs || !education || !ethnicity || !income || !location || !pets || !smokes || !speaks) {
        return util.buildResponse(401, {
            message: 'All fields required'
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (dynamoUser && dynamoUser.username) {
        return util.buildResponse(401, {
            message: 'Username already taken. Please choose a different username.'
        })
    }

    const encryptedPasswd = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPasswd,
        age: age,
        sex: sex,
        orientation: orientation,
        diet: diet,
        drinks: drinks,
        drugs: drugs,
        education: education,
        ethnicity: ethnicity,
        income: income,
        location: location,
        pets: pets,
        smokes: smokes,
        speaks: speaks
    }

    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {
            message: 'Server Error'
        })
    }

    return util.buildResponse(200, {
        username: username
    })
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

module.exports.register = register;