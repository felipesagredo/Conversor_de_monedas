// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import connectDB from './db';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';
axios.defaults.headers.common['Authorization'] = '';


connectDB().then(() => {
    const app = createApp(App);
    app.mount('#app');
});
