/**
* Rendimientos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'rendimientos',
	attributes: {
		idRendimiento: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
		
		bombeo: {
			type: 'float',
		},
		altura: {
			type: 'float',
		},

		idBomba: {
			model: 'Bombas',
		},
	}
};