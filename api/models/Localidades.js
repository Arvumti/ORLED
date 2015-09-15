/**
* Localidades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'Localidades',
	attributes: {
		nombre: {
			type: 'string',
		},
		
		latitud: {
			type: 'float',
		},
		longitud: {
			type: 'float',
		},

		idEstado: {
			model: 'Estados',
		},
	}
};