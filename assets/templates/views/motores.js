var MoMotor = Backbone.Model.extend({
	defaults: {
		idMotor 	    :0,
		nombre 			:'',
		capacidad		:'',
		energia 		:'',
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViMotores = viewsBase.abc.extend({
		el: '#motores',
		events: {},
		initialize: function() {
			this.pk = 'idMotor';
			this.url = '/motores';
			this.model = MoMotor;

			this.extras = {
				clean: ['nombre','energia', 'capacidad'],
			};

			var columns = [
				{nombre:'Nombre', field:'nombre', width:1000},
				{nombre:'Energia', field:'energia', width:250},
				{nombre:'Capacidad', field:'capacidad', width:250},
			];
			viewsBase.abc.prototype.initialize.call(this, columns);

			this.popAction.mode = {
				SaveAndContinue: true
			};
		},
	});
	return {view:ViMotores};
});