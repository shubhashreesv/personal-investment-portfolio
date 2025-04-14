import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

export const registerUser = (username, email, password) => {
    return axios.post(API_URL + "register/", {
        username,
        email,
        password,
    });
};

export const loginUser = (username, password) => {
    return axios.post(API_URL + "login/", {
        username,
        password,
    });
};
