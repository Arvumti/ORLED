var deps = [
	'/js/base/viewsBase.js',
	'/templates/views/mapaElementos.js',
	'/templates/views/principal/graficas.js',
];

define(deps, function (viewsBase, mapaElementos, graficas) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {
			'click .btn-calcular' :'click_Calcular',
			'click .openItemModal' :'click_openItems',
			'click table tbody tr.selectCell' :'rowSelected',
			'change [data-field="idLongitudTuberia"]': 'change_idLongitudTuberia',			
		},
		initialize: function() {
			var that = this;			
			this.fks = {
				idPais: {
					url: 'paises',
					filters: [{filter:'nombre'}],
				},
				idEstado: {
					url: 'estados',
					filters: [{filter:'nombre'}],
				},
			};						
			var tyas = this.$el.find('.tya');
			viewsBase.popAbc.prototype.linkFks.call(this, tyas, this.fks);		
			this.gvBombas = this.$el.find('.gvBombas');		
			this.longTube = this.$el.find('.longTube');			
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			this.tmp_items = Handlebars.compile(this.$el.find('.tmp_items').html());
			that.bombas();
			this.subContent = this.$el.find('.sub-content');
			this.subViews = {
				mapaElementos: {
					elem: $(mapaElementos.html).appendTo(this.subContent),
					view: new mapaElementos.view({parentView:this}),
				},
				graficas: {
					elem: $(graficas.html).appendTo(this.subContent),
					view: new graficas.view({parentView:this}),
				},
			};	
			this.modalItems = this.$el.find('.modal-items');
			this.popItems = new ViPopItems({el:this.modalItems, parentView:this, tmp_items:this.tmp_items});
			//this.subViews.graficas.close();
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		click_openItems: function(e) {			
			var valor = $(e.currentTarget).data("valor");
			debugger
			this.popItems.render(valor);			
		},
		change_idLongitudTuberia: function(e) {
			var that=this;
			var valor = $(e.currentTarget).prop("checked");
			if(valor)
				that.longTube.attr('disabled', false);
			else
				that.longTube.attr('disabled', true).val('');
		},
		bombas: function() {
			var that = this;
			app.ut.request({url:'/bombas/populate', done:done});
			function done(data) {
				console.log(data);
				var arrDatosBombas=Array();
				if(data) {
					var info = data;
					debugger
					for (var i = 0; i < info.length; i++) {
						info[i]
						var bomba = {
							nombreBomba: info[i].nombre,
							alturaMinima: info[i].alturaMinima,
							alturaMaxima: info[i].alturaMaxima,							
							eficiencia: info[i].eficiencia,							
							generador: info[i].idGenerador.nombre,
							etatrack: '',
							accesorios:'',
							cable: info[i].idCable.nombre,
							tubo: info[i].idTubo.nombre,
							salida: info[i].idSalida.nombre,

						}
						arrDatosBombas.push(bomba);

					};
					var tr = that.tmp_bombas({bombas:arrDatosBombas});
					that.gvBombas.html(tr);
				}
			}
		},
		rowSelected: function(e) {
			debugger
			var that  = this;
			var rows = that.$el.find('tr').removeClass('isActive');
			var row =$(e.currentTarget).addClass('isActive');
			var nombreBomba =$(e.currentTarget).data("nombrebomba");
			var generador =$(e.currentTarget).data("generador");
			var cable =$(e.currentTarget).data("cable");

			var inputBomba = that.$el.find('.nombreBombaTabla');
			var inputGenerador =that.$el.find('.nombreGenerador');
			var inputCable =that.$el.find('.nombreCable');		
			inputBomba.val(nombreBomba);
			inputGenerador.val(generador);
			inputCable.val(cable);
		},
		/*------------------------- Eventos -----------------------------*/
		click_buscar: function() {
			this.form.submit();
		},	
		click_Calcular: function(){
			this.parentView.graficas.render();
			this.parentView.mapaElementos.close();
		},
	});
	var ViPopItems = Backbone.View.extend({
		events: {
			'click .aceptar-btn' :'click_datoSeleccionado',
			'click .btn-cancelar' :'click_btnCancelar',
			'click table tbody tr.selectCell' :'popRowSelected',
		},
		initialize: function(options) {
			var that = this;
			this.tmp_items = options.tmp_items;
			this.parentView = options.parentView;
			this.gvItems = this.$el.find('.gvItems');
			this.form = this.$el.find('.form-data');
		},
		/*------------------- Base -------------------*/
		render: function(val) {
			var that=this;
			var valor = parseInt(val);
			app.ut.request({url:'/bombas/populate', done:done});
			function done(data) {
				console.log(data);
				var arrDatosBombas=Array();
				if(data) {
					var info = data;
					debugger
					for (var i = 0; i < info.length; i++) {	
						switch (valor) {
							case 1:
								var bomba = {
									item: info[i].nombre,
									idBomba:info[i].idBomba,
									descripcion: "Bombas",
									tipoElemento:1,
								}
								arrDatosBombas.push(bomba);
								break;
							case 2:
								var bomba = {
									item: info[i].idGenerador.nombre,
									idGenerador:info[i].idGenerador,
									descripcion: "Generadores",
									tipoElemento:2,
								}
								arrDatosBombas.push(bomba);
								break;
							case 3:
								var bomba = {
									item: info[i].idCable.nombre,
									idCable:info[i].idCable,
									descripcion: "Cables",
									tipoElemento:3,
								}
								arrDatosBombas.push(bomba);
								break;							
						}

					};
					debugger
					var tr = that.tmp_items({items:arrDatosBombas});
					that.gvItems.html(tr);
					that.$el.foundation('reveal', 'open');
				}
			}
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		/*------------------- Eventos -------------------*/
		click_btnCancelar: function () {
			this.close();
		},
		popRowSelected: function(e) {
			debugger
			var that  = this;
			var rows = that.$el.find('tr').removeClass('isActive');
			var row =$(e.currentTarget).addClass('isActive');
		},
		click_datoSeleccionado: function() {
			debugger
			var that  = this;
			var row = that.$el.find('tr.isActive');
			debugger
			var popNombre = row.data("item");
			var tipoItem = row.data("tipoElemento");

			if (tipoItem==1) {
				var inputBomba = that.$el.find('.nombreBombaTabla');				
				inputBomba.val(popNombre);
			}
			if (tipoItem==2) {				
				var inputGenerador =that.$el.find('.nombreGenerador');
				inputGenerador.val(popNombre);
			}			
		},
	});
	return {view:ViOrled};
});