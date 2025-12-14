// rutas o endpoints del CRUD

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express(); // inicializar la aplicacion (servidor)

app.use(cors()) // implementar cors
app.use(express.json()) // API Rest

// Get de todos los empleados
app.get('/empleados', (req, res) => {
    const sqlQuery = 'SELECT * FROM iberosoftware.empleados';

    db.query(sqlQuery, (err, results) => {// Ejecutar la consulta en la base de datos 
        if (err) {
            return res
                .status(500)
                .json({ error: 'error al obtener los datos de los empleados', mensaje: err });
        }

        return res.json(results);
    });
});
 // TODO: agregar los campos nuevos salario, correo, telefono

// POST para crear empleados
app.post('/empleados', (req, res) => {
    const { nombre, edad, pais, cargo, salario, correo, telefono, anios } = req.body // indicamos que el objeto se arma con el bodi de la peticion

    const sqlQuery = 'INSERT INTO iberosoftware.empleados (nombre, edad, pais, cargo,salario, correo, telefono, anios) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sqlQuery, [nombre, edad, pais, cargo, salario, correo, telefono, anios], (err, result) => {
        if (err) {
            // Siempre logear el error completo en el servidor
            console.error('Error al guardar empleado:', err);

            // Puedes personalizar el mensaje según el tipo de error
            let status = 500;
            let message = 'Error interno al guardar el empleado';
            let code = 'EMPLOYEE_SAVE_ERROR';

            // Ejemplo: si tu tabla tiene una restricción UNIQUE y se violó:
            if (err.code === 'ER_DUP_ENTRY') {
                status = 409; // conflicto
                message = 'Ya existe un empleado con esos datos';
                code = 'DUPLICATE_EMPLOYEE';
            }

            return res
                .status(status)
                .json({
                    ok: false,
                    message,   // mensaje claro para mostrar al usuario
                    code,      // código de error para que el front lo pueda distinguir
                    // Solo envía detalles técnicos en desarrollo, NO en producción
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                });
        }

        return res.json({
            id: result.insertId,
            message: 'Empleado guardado correctamente',
            nombre,
            edad,
            pais,
            cargo,
            salario,
            correo,
            telefono,
            anios
        });
    });
});


// PUT para actualizar un empleado segun su id
app.put('/empleados/:id', (req, res) => {
    const { id } = req.params; // indicamos que el id llega por parametro de la peticion
    const { nombre, edad, pais, cargo, salario, correo, telefono, anios } = req.body

    const sqlQuery = 'UPDATE iberosoftware.empleados SET nombre=?, edad=?, pais=?, cargo=?, salario=?, correo=?, telefono=?, anios=? WHERE id =?'

    db.query(sqlQuery, [nombre, edad, pais, cargo, salario, correo, telefono, anios, id], (err, result) => {
        if (err) {
            return res
                .status(500)
                .json({ error: 'error al actualizar el empleado', mensaje: err });
        }

        return res.json({
            id: result.insertId,
            message: 'Empleado actualizado correctamente',
            nombre,
            edad,
            pais,
            cargo,
            salario,
            correo,
            telefono,
            anios
        });
    });
});


// DELETE para eliminar un empleado por su id
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params;

    const sqlQuery = 'DELETE FROM iberosoftware.empleados WHERE id =?'

    db.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el empleado', err)
            return res
                .status(500)
                .json({ error: 'error al eliminar el empleado', mensaje: err });
        }

        return res.json({
            message: 'Empleado eliminado correctamente'
        }
        );
    });
});

app.listen(3001, () => { // arrancar la aplicacion (levantar el servidor)
    console.log('Servidor corriendo en el puerto 3001');
});