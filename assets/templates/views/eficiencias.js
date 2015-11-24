var MoRendimiento = Backbone.Model.extend({
	defaults: {
		idRendimiento 	: 0,
		idTazon		: 0,
		bombeo 			: 0,
		eficiencia      : 0,
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
		el: '#eficiencias',
		events: {},
		initialize: function() {
			this.pk = 'idEficiencia';
			this.url = '/eficiencias';
			this.model = MoRendimiento;

			this.fks = {
				idTazon: {
					url: 'tazones',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['bombeo', 'eficiencia'],
			};

			var columns = [
				{nombre:'Tazon', field:'idTazon.nombre', width:300},
				{nombre:'Bombeo', field:'bombeo', width:250},
				{nombre:'Eficiencia', field:'eficiencia', width:250},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViRendimientos};
});