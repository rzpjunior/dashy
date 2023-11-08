import axios from 'axios';
const url = 'https://queserasera.my.id/motio-interview-3426635/json/2.json';
export default {
    login(credentials) {
        return axios
            .post(url)
            .then(response => response.data);
    },
};