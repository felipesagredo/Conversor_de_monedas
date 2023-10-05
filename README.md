![Badge en Desarollo](https://img.shields.io/badge/STATUS-EN%20DESAROLLO-green)
<h1 align="center"> Conversor UF a CLP </h1>

**Registro de conversiones UF a CLP** Método de instalación (Previamente instalado MongoDB y su extension Mongoosh).<br>
**MongoDB**: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.2-signed.msi <br>
**Mongoosh (shell de MongoDB)**: https://downloads.mongodb.com/compass/mongosh-2.0.1-win32-x64.zip
### Clonar el repositorio
git clone https://github.com/felipesagredo/Conversor_de_monedas.git
### Acceder a la Carpeta /Conversor_de_monedas
cd Conversor_de_monedas
### Dentro de la carpeta correr los siguientes comandos

#### npm install
#### npm run serve
#### node server/index.js

#### Solucion al iniciar 'node server/index.js':

Si tienes dificultad para iniciar el servidor con 'node server/index.js' es porque debes conectar la base de datos antes.<br><br>
Procura mantener iniciado mongod.exe y mongosh.exe sin cerrarlos.<br><br>
Una vez abierto mongoosh.exe te pedira un nombre para la Base de Datos, te recomiendo: db <br><br>
Si todo sale bien tendrás un mensaje en Verde similar al siguiente: <br><br>
**mongodb://127.0.0.1:27017/db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1** <br><br>
Este codigo lo reemplazarás dentro de index.js.

Abre el archivo index.js que se encuentra en server/index.js y reemplaza lo que está dentro de mongoose.connect(); en la siguiente linea. <br><br>

mongoose.connect('mongodb://127.0.0.1:27017/db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
<br><br>
Con eso ya debes iniciar correctamente 'node server/index.js' <br><br>



