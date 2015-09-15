var MoCable = Backbone.Model.extend({
	defaults: {
		idCable 	    : 0,
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
		el: '#cables',
		events: {},
		initialize: function() {
			this.pk = 'idCable';
			this.url = '/cables';
			this.model = MoCable;

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
	return {view:ViCables};
});