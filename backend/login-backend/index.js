const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const edituserService = require('./service/edituser');
const homePathService = require('./service/home');
const searchUserService = require('./service/search');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const edituserPath = '/edituser'
const homePath = '/home'
const searchPath = '/search'

exports.handler = async (event) => {
    console.log('Request event: ', event);
    let response;
    switch (true) {
        case event.httpMethod === 'GET' && event.path === searchPath:

            response = searchUserService.search(event.queryStringParameters);
            break;

        case event.httpMethod === 'POST' && event.path === homePath:
            response = homePathService.home(event.body);
            break;

        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;

        case event.httpMethod === 'POST' && event.path === edituserPath:
            const edituserBody = JSON.parse(event.body);
            response = await edituserService.edituser(edituserBody);
            break;

        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;

        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;

        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;

        default:
            response = util.buildResponse(404, '404 Not Found');

    }
    return response;
};
