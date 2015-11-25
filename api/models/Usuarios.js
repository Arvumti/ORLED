/**
* Usuarios.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'usuarios',
	attributes: {
		idUsuario: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		nombre: {
			type: 'string',
		},
		usuario: {
			type: 'string',
		},
		contrasenia: {
			type: 'string',
		},
	}
};