/**
* Bombas.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'bombas',
	attributes: {
		idBomba: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		nombre: {
			type: 'string',
		},

		alturaMaxima: {
			type: 'float',
		},
		alturaMinima: {
			type: 'float',
		},
		eficiencia: {
			type: 'float',
		},
		precioDistribuidor: {
			type: 'float',
		},
		precioLista: {
			type: 'float',
		},
		precioPublico: {
			type: 'float',
		},
		flujoMaximo: {
			type: 'float',
		},

		idCable: {
			model: 'Cables',
		},
		idMotor: {
			model: 'Motores',
		},
		idSalida: {
			model: 'Salidas',
		},
		idTubo: {
			model: 'Tubos',
		},
		idGenerador: {
			model: 'generadores',
		},

		Compuestos: {
            collection: 'Compuestos',
            via: 'idBomba'
        },
        // Eficiencias: {
        //     collection: 'Eficiencias',
        //     via: 'idGenerador'
        // },
	}
};