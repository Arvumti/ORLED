var MoGenerador = Backbone.Model.extend({
	defaults: {
		idGenerador 	: 0,
		diagrama 		: '',
		activo			: 1,
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
				{nombre:'Nombre', field:'nombre', width:1000},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViGeneradores};
});