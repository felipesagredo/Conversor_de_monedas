<template>
    <div>
    <h1>Pruebas con Mongoose y Conversión de UF a CLP</h1>
    <!-- Sección para convertir UF a CLP -->
    <form @submit.prevent="convertUF">
        <label for="amount">Cantidad en UF:</label>
        <input type="number" v-model="amount" id="amount" step="1" min="0">
        <input type="date" v-model="selectedDate">
        <button type="submit">Convertir UF a CLP</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <p v-else-if="ufValue">
        Fecha: {{ formattedDate(ufValue.fecha) }}<br>
        Cantidad de UF: {{ ufQuantity }}<br>
        Valor histórico UF: ${{ ufValor }}<br>
        Cantidad de UF en CLP: ${{ convertedAmount }}<br>
    </p>
    <!-- Sección para agregar y mostrar datos de la base de datos -->
    <h2>Manejo de datos con Mongoose</h2>
    <input v-model="newMessage" placeholder="Escribe un mensaje" />
    <input v-model="additionalMessage" placeholder="Escribe un mensaje adicional" />
    <button @click="addData">Agregar dato</button>
    <button @click="getSavedData">Consultar datos</button>
    <button @click="deleteData">Eliminar dato</button>
    <div v-if="data">
        <h3>Dato agregado:</h3>
        <pre>{{ data.message }}</pre>
        <pre>Cantidad en UF: {{ data.amount }}</pre>
        <pre>Valor histórico UF: {{ data.ufValor }}</pre>
        <pre>{{ data.additionalMessage }}</pre>
    </div>
    <div v-if="savedData.length > 0">
        <h3>Datos en la base de datos:</h3>
        <ul>
        <li v-for="item in savedData" :key="item._id">
            {{ item.message }}
            <br />
            Cantidad en UF: {{ item.amount }}
            <br />
            Valor histórico UF: {{ item.ufValor }}
            <br />
            {{ item.additionalMessage }}
            <br><br>
        </li>
        </ul>
    </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
    return {
        ufValue: null,
        selectedDate: null,
        amount: null,
        error: null,
        newMessage: '',
        ufValor: null,
        ufQuantity: null, // Added UF quantity property
        additionalMessage: '',
        data: null,
        savedData: []
    };
    },
    computed: {
    convertedAmount() {
        if (!this.amount || !this.ufValue) {
        return 0;
        }
        const amountInCLP = Math.ceil(this.amount * this.ufValue.valor);
        return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(amountInCLP);
    }
    },
    methods: {
        async convertUF() {
            if (!this.selectedDate) {
                this.error = 'Seleccione una fecha.';
                return;
            }
            const formattedDate = this.formatDate(this.selectedDate);
            try {
                const response = await axios.get(`http://localhost:3000/uf/${formattedDate}`);
                this.ufValue = response.data.serie[0];
                this.error = null;  // Clear previous errors
                // Calculate UF quantity based on the provided amount and UF value
                this.ufQuantity = this.amount;
                this.ufValor = this.ufValue.valor;
                // Add the UF conversion data to the database
                const message = `Fecha histórica UF: ${formattedDate}`;
                const additionalMessage = `Cantidad UF en CLP: $${this.convertedAmount}`;
                await this.addDataToDatabase(message, additionalMessage, this.ufQuantity, this.ufValor);
                // Refresh saved data from the database
                await this.getSavedData();
            } catch (error) {
                console.error('Error al obtener el valor de la UF:', error);
                this.error = 'Error al obtener el valor de la UF.';
            }
        },
        // Function to add data to the database
        async addDataToDatabase(message, additionalMessage, ufQuantity, ufValor) {
            try {
            const response = await axios.post('http://localhost:3000/api/data', {
                message,
                additionalMessage,
                amount: ufQuantity, // Include the UF quantity
                ufValor: ufValor // Include the value of UF
            });
            this.data = response.data;
            } catch (error) {
                console.error('Error al agregar el dato:', error);
            }
        },
        formatDate(date) {
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        },
        formattedDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-CL', options);
        },
        // ... otros métodos relacionados con la conversión UF a CLP ...
        async addData() {
            try {
            const response = await axios.post('http://localhost:3000/api/data', {
                additionalMessage: this.additionalMessage, // Incluir el mensaje adicional
                message: this.newMessage,
                amount: this.amount, // Include the amount in UF
                ufValor: this.ufValor // Agregar el valor de la UF a la solicitud POST
            });
            this.data = response.data;
                this.newMessage = ''; // Limpiar el input después de agregar
                this.additionalMessage = ''; // Limpiar el input adicional después de agregar
            } catch (error) {
            console.error('Error al agregar el dato:', error);
            }
        },
        async getSavedData() {
            try {
            const response = await axios.get('http://localhost:3000/api/data');
            this.savedData = response.data;
            } catch (error) {
            console.error('Error al obtener datos:', error);
            }
        },
        async deleteData() {
            try {
            if (this.savedData.length === 0) {
                alert('No hay datos para eliminar.');
                return;
            }
            const dataIdToDelete = this.savedData[0]._id;
            await axios.delete(`http://localhost:3000/api/data/${dataIdToDelete}`);
            this.savedData = this.savedData.filter(item => item._id !== dataIdToDelete);
            } catch (error) {
            console.error('Error al eliminar el dato:', error);
            }
        }
    }
};
</script>

<style scoped>
/* Estilos específicos para este componente si es necesario */
</style>
