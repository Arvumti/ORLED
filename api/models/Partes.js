/**
* Partes.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'Partes',
	attributes: {
		idParte: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		nombre: {
			type: 'string',
		},
		
		descripcion: {
			type: 'string',
		},
	}
};