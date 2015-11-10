/**
* Arreglos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'arreglos',
	attributes: {
		idArreglo: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},

		serie: {
			type: 'integer',
		},
		paralelo: {
			type: 'integer',
		},
		potencia: {
			type: 'float',
		},
		voltaje: {
			type: 'float',
		},
		corriente: {
			type: 'float',
		},
	}
};