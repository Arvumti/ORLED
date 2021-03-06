var MoBombas = Backbone.Model.extend({
	defaults: {
		idBomba				:0,
		nombre				:'',
		alturaTope			:0,
		alturaMaxima		:0,
		alturaMinima		:0,
		eficiencia 			:0,
		precioDistribuidor	:0,
		precioLista			:0,
		precioPublico		:0,
		flujoMaximo			:0,
		idCable				:0,
		idMotor				:0,
		idSalida			:0,
		idTubo				:0,
		idGenerador			:0,
		idTazon				:0,
	}
});
define(['/js/base/viewsBase.js'], function (viewsBase) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViBombas = viewsBase.abc.extend({
		el: '#bombas',
		events: {
			'click .btn-aceptar' :'click_aceptar'
		},
		initialize: function() {
			this.pk = 'idBomba';
			this.url = '/bombas';
			this.model = MoBombas;

			this.fks = {
				idCable: {
					url: 'cables',
					filters: [{filter:'nombre'}],
				},
				idTubo: {
					url: 'tubos',
					filters: [{filter:'nombre'}],
				},
				idSalida: {
					url: 'salidas',
					filters: [{filter:'nombre'}],
				},
				idMotor: {
					url: 'motores',
					filters: [{filter:'nombre'}],
				},
				idGenerador: {
					url: 'generadores',
					filters: [{filter:'nombre'}],
				},
				idTazon: {
					url: 'tazones',
					filters: [{filter:'nombre'}],
				},
			};

			this.extras = {
				clean: ['alturaMin','alturaMax'],
			};

			var columns = [
				{nombre:'Bombas', field:'nombre', width:200},
				{nombre:'Generador', field:'idGenerador.nombre', width:100},
				{nombre:'Tazon', field:'idTazon.nombre', width:100},
				{nombre:'Altura Mínima', field:'alturaMinima', width:100},
				{nombre:'Altura Máxima', field:'alturaMaxima', width:100},
				{nombre:'Altura Tope', field:'alturaTope', width:100},
			];
			viewsBase.abc.prototype.initialize.call(this, columns, null);
		},
	});
	return {view: ViBombas};
});