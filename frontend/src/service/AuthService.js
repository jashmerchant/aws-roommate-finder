module.exports = {
    getUser: function () {
        const user = sessionStorage.getItem('user');
        if (user === 'undefined' || !user) {
            return null;
        } else {
            return JSON.parse(user);
        }
    },

    getUsers: function () {
        const users = sessionStorage.getItem('scanResult');
        if (users === 'undefined' || !users) {
            return null;
        } else {
            return JSON.parse(users);
        }
    },

    getToken: function () {
        return sessionStorage.getItem('token');
    },

    setUserSession: function (user, token, scanResult) {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('scanResult', JSON.stringify(scanResult));
    },

    resetUserSession: function () {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('scanResult');
    }
}