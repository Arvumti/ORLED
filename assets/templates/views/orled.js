var MoOrled = Backbone.Model.extend({
	defaults: {
		idBomba				:0,
		nombre				:'',
		alturaMaxima		:0,
		eficiencia 			:0,
		idCable				:0,
		idGenerador			:0,
		idMotor				:0,
		idSalida			:0,
		idTubo				:0,

	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViOrled = viewsBase.abc.extend({
		el: '#orled',
		events: {
			'click .btn-aceptar' :'click_aceptar'
		},
		initialize: function() {
			this.pk = 'idBomba';
			this.url = '/bombas';
			this.model = MoOrled;

			this.fks = {
				idEstado: {
					url: 'estados',
					filters: [{filter:'nombre'}],
				},
				idPais: {
					url: 'paises',
					filters: [{filter:'nombre'}],
				},				
			};			
 
			var columns = [
				{nombre:'Sistema de Bombeo', field:'nombre', width:1000},
				{nombre:'Generador PV', field:'idGenerador', width:200},
				{nombre:'ETATRACK', field:'alturaMaxima', width:1000},
				{nombre:'Accesorios', field:'eficiencia', width:1000},
				{nombre:'Cable', field:'idCable', width:1000},
				{nombre:'Tubo D', field:'idTubo', width:1000},
				{nombre:'Tubo S', field:'idTubo', width:1000},
				{nombre:'Altura', field:'alturaMinima', width:1000},
				{nombre:'Output', field:'idSalida', width:1000},
				{nombre:'Eficiencia', field:'eficiencia', width:1000},
			];
			viewsBase.abc.prototype.initialize.call(this, columns, null);
		},
	});
	return {view: ViOrled};
});