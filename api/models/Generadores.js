/**
* Generadores.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'generadores',
	attributes: {
		idGenerador: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		nombre: {
			type: 'string',
		},
		frecuencia: {
			type: 'float',
		},
		potencia: {
			type: 'float',
		},

		diagrama: {
			type: 'string',
		},
		Compuestos: {
			collection: 'Compuestos',
			via: 'idGenerador'
		},
	}
};