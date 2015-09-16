/**
* IrradianciasDias.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoUpdatedAt: true,
	tableName: 'IrradianciasDias',
	attributes: {
		enero: {
			type: 'float',
		},
		febrero: {
			type: 'float',
		},
		marzo: {
			type: 'float',
		},
		abril: {
			type: 'float',
		},
		mayo: {
			type: 'float',
		},
		junio: {
			type: 'float',
		},
		julio: {
			type: 'float',
		},
		agosto: {
			type: 'float',
		},
		septiembre: {
			type: 'float',
		},
		octubre: {
			type: 'float',
		},
		noviembre: {
			type: 'float',
		},
		diciembre: {
			type: 'float',
		},
		hora: {
			type: 'integer',
		},

		idLocalidad: {
			model: 'Localidades',
		},
	}
};