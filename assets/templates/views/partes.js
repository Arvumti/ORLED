var MoParte = Backbone.Model.extend({
	defaults: {
		idParte 	    : 0,
		nombre 			: '',
		descripcion 	: '',
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViPartes = viewsBase.abc.extend({
		el: '#partes',
		events: {},
		initialize: function() {
			this.pk = 'idParte';
			this.url = '/partes';
			this.model = MoParte;

			this.extras = {
				clean: ['nombre', 'descripcion'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:600},
				{nombre:'Descripción', field:'descripcion', width:400},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViPartes};
});