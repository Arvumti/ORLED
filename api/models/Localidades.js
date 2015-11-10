/**
* Localidades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'localidades',
	attributes: {
		idLocalidad: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		nombre: {
			type: 'string',
		},
		
		latitud: {
			type: 'string',
		},
		longitud: {
			type: 'string',
		},

		idEstado: {
			model: 'Estados',
		},
		idPais: {
			model: 'Paises',
		},
	}
};