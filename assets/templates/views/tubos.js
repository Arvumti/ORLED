var MoTubo = Backbone.Model.extend({
	defaults: {
		idTubo	 	    : 0,
		nombre 			: '',
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
	var ViTubos = viewsBase.abc.extend({
		el: '#tubos',
		events: {},
		initialize: function() {
			this.pk = 'idTubo';
			this.url = '/tubos';
			this.model = MoTubo;

			this.extras = {
				clean: ['nombre','tipo','medida'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:500},
				{nombre:'Tipo', field:'tipo', width:250},
				{nombre:'Medida', field:'medida', width:250},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViTubos};
});