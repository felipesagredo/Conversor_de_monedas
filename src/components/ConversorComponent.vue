<template>
    <!-- Botón para cerrar sesión -->
    <div class="container">
        <div class="row">
            <!-- Primera columna para la Conversión UF a CLP -->
            <div class="btn-container col-md-12">
                <button @click="logout" class="btn btn-outline-secondary">Cerrar Sesión</button>
                
            </div>
        <div class="col-md-4">
            <div class="conversion-section rounded p-4">
                <h2 class="text-orange">Conversión UF a CLP</h2>
                <form @submit.prevent="convertUF" class="mb-4">
                <div class="form-group">
                    <label for="amount" class="text-dark">Cantidad de UF:</label>
                    <input type="number" v-model="amount" id="amount" step="1" min="0" class="form-control custom-input"/>
                </div>
                <div class="form-group">
                    <label for="date" class="text-dark">Fecha:</label>
                    <input type="date" v-model="selectedDate" class="form-control custom-input" />
                </div><br>
                    <button type="submit" class="btn btn-primary">Convertir UF a CLP</button>
                </form>
                <div v-if="error" class="mt-3">
                    <p class="text-danger">{{ error }}</p>
                </div>
                <div v-else-if="ufValue" class="estilo-datos">
                    <h3 class="mt-5 text-orange">Datos Consultados:</h3>
                    <p class="text-dark">
                    Fecha: {{ formattedDate(ufValue.fecha) }}<br />
                    Hora: {{ currentTime }}<br/>
                    Valor UF: ${{ ufValue.valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}<br />
                    Cantidad de UF: {{ ufQuantity ? ufQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A' }}<br />
                    Cantidad de UF en CLP: ${{ convertedAmount }}<br />
                    </p>
                </div>
            </div>
        </div>
    <!-- Segunda columna para Datos de la base de datos -->
    <div class="col-md-6">
        <div class="data-section rounded p-4">
            <h2 class="text-gris">Historial de Consultas</h2>
            <button @click="getSavedData" class="btn btn-primary">Ver datos</button>
            <button @click="exportToExcel" class="btn btn-success">Exportar a Excel</button>
            <br>
            <br>
            <div v-if="savedData.length > 0" class="estilo-datos">
                <div class="card" v-for="item in reversedSavedData" :key="item._id">
                    <div class="card-body">
                        <h5 class="card-title">{{ item.message }}</h5>
                        <p class="card-text">Hora: {{ item.currentTime }}</p>
                        <p class="card-text">Valor UF: ${{ item.ufValor ? item.ufValor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A' }}</p>
                        <p class="card-text">Cantidad de UF: {{ item.amount ? item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A' }}</p>
                        <p class="card-text">{{item.amount}}{{ item.additionalMessage }}</p>
                        <button @click="deleteData(item._id)" class="btn btn-danger ml-auto">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
    data() {
    return {
        ufValue: null,
        selectedDate: null,
        amount: null,
        error: null,
        newMessage: '',
        ufValor: null,
        currentTime: null,
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
    },
    reversedSavedData() {
        return this.savedData.slice().reverse();
    }
    },
    methods: {
        async convertUF() {
            if (!this.selectedDate) {
                this.error = 'Seleccione una fecha.';
                return;
            }
            // Verificar si la cantidad es un número válido
            const parsedAmount = parseFloat(this.amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                this.error = 'Ingrese una cantidad válida de UF.';
                return;
            }
            // Obtener la hora actual
            const currentTime = new Date().toLocaleTimeString();
            this.currentTime = currentTime;
            const formattedDate = this.formatDate(this.selectedDate);
            try {
                const response = await axios.get(`http://localhost:3000/uf/${formattedDate}`);
                this.ufValue = response.data.serie[0];
                this.error = null;
                this.ufQuantity = this.amount;
                this.ufValor = this.ufValue.valor;
                const message = `Fecha: ${formattedDate}`;
                const additionalMessage = `UF en CLP: $${this.convertedAmount}`;
                await this.addDataToDatabase(message, additionalMessage, this.ufQuantity, this.ufValor, this.currentTime);
                await this.getSavedData();
            } catch (error) {
                console.error('Error al obtener el valor de la UF:', error);
                this.error = 'Error al obtener el valor de la UF.';
            }
        },
        exportToExcel() {
        const data = [
        // Data for Excel, e.g., savedData
        // Modify this data according to your requirements
        ['Fecha', 'Hora', 'Valor UF', 'Cantidad de UF', 'Conversion UF a CLP'],
        ...this.savedData.map(item => [
            item.message,
            item.currentTime,
            item.ufValor ? `$${item.ufValor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : 'N/A',
            item.amount ? item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'N/A',
            item.additionalMessage
        ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Historial_consultas');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historial_consultas.xlsx';
        a.click();
        },
        async addDataToDatabase(message, additionalMessage, ufQuantity, ufValor, currentTime) {
            try {
            const response = await axios.post('http://localhost:3000/api/data', {
                message,
                additionalMessage,
                amount: ufQuantity,
                ufValor: ufValor,
                currentTime: currentTime
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
        async deleteData(dataId) {
        try {
            await axios.delete(`http://localhost:3000/api/data/${dataId}`);
            this.savedData = this.savedData.filter(item => item._id !== dataId);
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
  max-width: 80%; /* Ajusta el ancho máximo según tu preferencia */
}

.text-orange {
    color: rgb(255,88,0);
}

.text.gris {
    color: rgb(105,104,128);
}
.estilo-datos {
    font-family: inherit;
}
.btn-outline-secondary{
    margin: auto;
    width: fit-content;
}
.btn-container{
    margin-top: 20px;
    text-align: right;
}
.btn-success {
    margin-left: 20px;
}
</style>
