var deps = [
	'/js/base/viewsBase.js',
	'/templates/views/mapaElementos.js',
	'/templates/views/principal/graficas.js',
	'/templates/views/principal/cableado.js'
];

define(deps, function (viewsBase, mapaElementos, graficas, cableado) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {
			'click .btn-calcular' :'click_calcular',
			//'click .tab-cableado' : 'click_tabCableado',
			'click .tabs a' : 'click_tabs',
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
			that.bombas();
			this.subContent = this.$el.find('.sub-content');
			this.subContentCableado = this.$el.find('.sub-content-cableado');
			this.subViews = {
				mapaElementos: {
					elem: $(mapaElementos.html).appendTo(this.subContent),
					view: new mapaElementos.view({parentView:this}),
				},
				graficas: {
					elem: $(graficas.html).appendTo(this.subContent),
					view: new graficas.view({parentView:this}),
				},
				cableado: {
					elem: $(cableado.html).appendTo(this.subContentCableado),
					view: new cableado.view({parentView:this}),
				},
			};	
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
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
		/*------------------------- Eventos -----------------------------*/
		click_buscar: function() {
			this.form.submit();
		},	
		click_calcular: function(){
			debugger
			this.subViews.graficas.view.render();
			debugger
			this.subViews.mapaElementos.view.close();
		},
		click_tabs: function(e) {
			debugger
			var href = $(e.currentTarget).attr('href');
			switch(href) {
				case '#entradas':
					this.subViews.mapaElementos.view.close();
					this.subViews.graficas.view.render();
				break;
				case '#cableado':
					this.subViews.graficas.view.close();
					this.subViews.mapaElementos.view.close();
					this.subViews.cableado.view.render();
				break;
			}
		},
	});
	return {view:ViOrled};
});