/**
* Paneles.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'Paneles',
	attributes: {
		nombre: {
			type: 'string',
		},
		
		capacidad: {
			type: 'float',
		},
	}
};