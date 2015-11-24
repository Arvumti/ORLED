var MoCable = Backbone.Model.extend({
	defaults: {
		idTazon 	    : 0,
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
	var ViCables = viewsBase.abc.extend({
		el: '#tazones',
		events: {},
		initialize: function() {
			this.pk = 'idTazon';
			this.url = '/tazones';
			this.model = MoCable;

			this.extras = {
				clean: ['nombre'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:800},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViCables};
});