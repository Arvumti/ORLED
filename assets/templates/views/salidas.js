var MoSalida = Backbone.Model.extend({
	defaults: {
		idTubo	 	    : 0,
		nombre 			: '',
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViSalidas = viewsBase.abc.extend({
		el: '#salidas',
		events: {},
		initialize: function() {
			this.pk = 'idSalida';
			this.url = '/salidas';
			this.model = MoSalida;

			this.extras = {
				clean: ['nombre','tipo','diametro','largo'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:1000},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViSalidas};
});