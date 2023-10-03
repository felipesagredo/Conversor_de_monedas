// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import connectDB from './db';

connectDB().then(() => {
    const app = createApp(App);
    app.mount('#app');
});
