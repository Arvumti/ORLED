var MoTubo = Backbone.Model.extend({
	defaults: {
		idTubo	 	    :0,
		nombre 			:'',
		diametro 		:0,
		largo 			:'',
		tipo 			:'',
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
				clean: ['nombre','tipo','diametro','largo'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:400},
				{nombre:'Tipo', field:'tipo', width:200},
				{nombre:'Diámetro', field:'diametro', width:200},
				{nombre:'Largo', field:'largo', width:200},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViTubos};
});