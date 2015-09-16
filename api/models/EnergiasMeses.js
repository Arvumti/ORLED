/**
* EnergiasMeses.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'EnergiasMeses',
	attributes: {
		idEnergiaMes: {
			type: 'integer',
			primaryKey: true,
			autoIncrement:true,
			unique: true,
		},
	}
};