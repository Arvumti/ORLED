var MoBombas = Backbone.Model.extend({
	defaults: {
		idBomba			 		: 0,
		idAdeudo 				: 0,
		idPlantel 				: 0,
		obligatorio 			: 0,
		valor					: 0,
		activo					: 1,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViBombas = viewsBase.abc.extend({
		el: '#bombas',
		events: {
			'click .btn-aceptar' :'click_aceptar'
		},
		initialize: function() {
			this.pk = 'idBomba';
			this.url = '/bombas';
			this.model = MoBombas;

			this.fks = {
				idGenerador: {
					url: 'generadores',
					filters: [{filter:'nombre'}],
				},
				idCable: {
					url: 'cables',
					filters: [{filter:'nombre'}],
				},
				idTubo: {
					url: 'tubos',
					filters: [{filter:'nombre'}],
				},
				idSalida: {
					url: 'salidas',
					filters: [{filter:'nombre'}],
				},
				idMotor: {
					url: 'motores',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['idAdeudo','valor'],
			};

			var columns = [
				{nombre:'Generador', field:'nombre', width:1000},
			];
			viewsBase.abc.prototype.initialize.call(this, columns, null);		
		},
	});
	return {view: ViBombas};
});