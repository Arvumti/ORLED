var MoRendimiento = Backbone.Model.extend({
	defaults: {
		idRendimiento 	: 0,
		idBomba			: 0,
		bombeo 			: 0,
		altura 			: 0,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViRendimientos = viewsBase.abc.extend({
		el: '#rendimientos',
		events: {},
		initialize: function() {
			this.pk = 'idRendimiento';
			this.url = '/rendimientos';
			this.model = MoRendimiento;

			this.fks = {
				idBomba: {
					url: 'bombas',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['bombeo', 'altura'],
			};

			var columns = [
				{nombre:'Bomba', field:'idBomba.nombre', width:250},
				{nombre:'Bombeo', field:'bombeo', width:250},
				{nombre:'Altura', field:'altura', width:250},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViRendimientos};
});