var MoGenerador = Backbone.Model.extend({
	defaults: {
		idArreglo 		: 0,
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
		el: '#arreglos',
		events: {},
		initialize: function() {
			this.pk = 'idArreglo';
			this.url = '/arreglos';
			this.model = MoGenerador;

			this.extras = {
				clean: ['paralelo', 'serie', 'potencia', 'voltaje', 'corriente'],
			};

			var columns = [
				{nombre:'Modulos Serie', field:'serie', width:200},
				{nombre:'Modulos Paralelo', field:'paralelo', width:200},
				{nombre:'Potencia', field:'potencia', width:200},
				{nombre:'Voltaje', field:'voltaje', width:200},
				{nombre:'Corriente', field:'corriente', width:200},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViGeneradores};
});