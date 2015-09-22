var MoGenerador = Backbone.Model.extend({
	defaults: {
		idGenerador 	: 0,
		nombre			: '',
		diagrama 		: '',
		paralelo 		: 0,
		serie           : 0,
		potencia 		: 0,
		voltaje 		: 0,
		corriente 		: 0,
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
				clean: ['nombre', 'paralelo', 'serie', 'potencia','voltaje', 'corriente'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:250},
				{nombre:'Modulos Paralelo', field:'paralelo', width:150},
				{nombre:'Modulos Serie', field:'serie', width:150},
				{nombre:'Potencia', field:'potencia', width:150},
				{nombre:'Voltaje', field:'voltaje', width:150},
				{nombre:'Corriente', field:'corriente', width:150},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViGeneradores};
});