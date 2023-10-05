<template>
    <div class="container mt-5">
        <!-- Botón para cerrar sesión -->
        <button @click="logout" class="btn btn-secondary">Cerrar Sesión</button>
        <br><br><br>
        <!-- Sección de conversión UF a CLP -->
        <div>
            <h1>Conversión UF a CLP</h1>
            <form @submit.prevent="convertUF" class="mb-4">
                <div class="form-group">
                    <label for="amount">Cantidad de UF:</label>
                    <input type="number" v-model="amount" id="amount" step="1" min="0" class="form-control custom-input" />
                </div>
                <div class="form-group">
                    <label for="date">Fecha:</label>
                    <input type="date" v-model="selectedDate" class="form-control custom-input" />
                </div>
                    <button type="submit" class="btn btn-primary">Convertir UF a CLP</button>
            </form>
            <div v-if="error" class="mt-3">
                <p class="text-danger">{{ error }}</p>
            </div>
            <div v-else-if="ufValue" class="mt-3">
                <h2 class="mt-5">Datos Consultados:</h2>
                <p>
                    Fecha: {{ formattedDate(ufValue.fecha) }}<br>
                    Valor UF: ${{ ufValor }}<br>
                    Cantidad de UF: {{ ufQuantity }}<br>
                    Cantidad de UF en CLP: ${{ convertedAmount }}<br>
                </p>
            </div>
        </div>
        <!-- Sección de manejo de datos con Mongoose -->
        <div>
            <h2 class="mt-5">Manejo de datos</h2>
            <button @click="getSavedData" class="btn btn-info">Consultar datos</button>
            <button @click="deleteData" class="btn btn-danger">Eliminar dato</button>
            <div v-if="savedData.length > 0" class="mt-3">
                <h3>Datos en la base de datos:</h3>
                <div class="card" v-for="item in savedData" :key="item._id">
                    <div class="card-body">
                        <h5 class="card-title">{{ item.message }}</h5>
                        <p class="card-text">Valor UF: ${{ item.ufValor }}</p>
                        <p class="card-text">Cantidad de UF: {{ item.amount }}</p>
                        <p class="card-text">{{ item.additionalMessage }}</p>
                    </div>
                </div>
            </div>
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
                const message = `Valor de la UF en la Fecha: ${formattedDate}`;
                const additionalMessage = `UF en CLP: $${this.convertedAmount}`;
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
        async getSavedData() {
            try {
            const response = await axios.get('http://localhost:3000/api/data');
            this.savedData = response.data;
            if (this.savedData.length === 0) {
                alert('No hay datos para mostrar.');
            }
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
        },
        logout() {
            this.$emit('logout'); // Evento de cierre de sesión
        }
    },
    emits: ['logout']
};
</script>

<style scoped>
/* Estilos específicos del componente */
.btn-danger {
  margin-left: 0px; /* Espacio entre el botón y el contenido */
}
/* Estilos para la lista de datos */
ul {
  list-style: none;
  padding: 10px;
}
ul li {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}
.custom-input {
  max-width: 250px; /* Ajusta el ancho máximo según tu preferencia */
}
</style>
