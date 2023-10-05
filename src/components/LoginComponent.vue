<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <h2>Inicia Sesión</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="username">Usuario:</label>
            <input type="text" id="username" v-model="username" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña:</label>
            <input type="password" id="password" v-model="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary">Iniciar Sesión</button><br><br><br><br><br>
        </form>
      </div>
        <div class="col-md-6">
          <h2>Regístrate</h2>
          <form @submit.prevent="register">
            <div class="form-group">
              <label for="newUsername">Nuevo Usuario:</label>
              <input type="text" id="newUsername" v-model="newUsername" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="newPassword">Contraseña:</label>
              <input type="password" id="newPassword" v-model="newPassword" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success">Registrarse</button>
          </form>
        </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        newUsername: '',
        newPassword: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('/login', {
            username: this.username,
            password: this.password,
          });
          console.log('Login successful!', response.data);
          this.$emit('login-success');
        } catch (error) {
          console.error('Login failed.', error.response.data.message);
        }
      },
      async register() {
        try {
          const response = await axios.post('/register', {
            username: this.newUsername,
            password: this.newPassword,
          });
  
          console.log('Registration successful!', response.data);
        } catch (error) {
          console.error('Registration failed.', error.response.data.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  
  .row {
    margin-top: 20px;
  }
  
  /* Estilos para los títulos */
  h2 {
    margin-bottom: 20px;
  }
  
  /* Estilos para los formularios */
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  
  /* Estilos para los botones */
  .btn {
    padding: 10px 20px;
    margin-right: 10px;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: #fff;
    border: none;
  }
  
  .btn-success {
    background-color: #2ecc71;
    color: #fff;
    border: none;
  }
  
  .btn-primary:hover,
  .btn-success:hover {
    background-color: #2980b9;
  }
  
  /* Estilos para los enlaces (pueden usarse para cambiar entre login y registro) */
  .link {
    color: #3498db;
    cursor: pointer;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  </style>
  
  