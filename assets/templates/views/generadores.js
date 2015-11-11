var MoGenerador = Backbone.Model.extend({
	defaults: {
		idGenerador 	: 0,
		nombre			: '',
		diagrama 		: '',
		frecuencia 		: 0,
		potencia 		: 0,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViGeneradores = viewsBase.abc.extend({
		el: '#generadores',
		events: {},
		initialize: function() {
			this.pk = 'idGenerador';
			this.url = '/generadores';
			this.model = MoGenerador;

			this.extras = {
				clean: ['nombre'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:600},
				{nombre:'Frecuencia', field:'frecuencia', width:100},
				{nombre:'Potencia', field:'potencia', width:100},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViGeneradores};
});