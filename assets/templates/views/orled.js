define(['/js/base/viewsBase.js'], function (viewsBase) {
	var ViOrled = Backbone.View.extend({
		el: '#orled',
		events: {
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
			debugger
			this.gvBombas = this.$el.find('.gvBombas');
			this.tmp_bombas = Handlebars.compile(this.$el.find('.tmp_bombas').html());
			that.bombas();
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			viewsBase.abc.prototype.render.call(this);
		},
		close: function() {
			viewsBase.abc.prototype.close.call(this);
		},
		change_idLongitudTuberia: function(e) {
			var valor = $(e.currentTarget).prop("checked");
			debugger
			if(valor)
				this.documentosEntregados.find('[data-field="longitudTuberia"]').prop('disabled', true);
			else
				this.documentosEntregados.find('[data-field="longitudTuberia"]').prop('disabled', false);
		},
		bombas: function() {
			app.ut.request({url:'/bombas',done:done});
			function done(data) {
				debugger
				console.log(data);
				if(data) {					
					var that = this;
					var info= data.data;
					var tr = that.tmp_bombas(info);
					that.gvBombas.html(tr);
				}
			}
			
		},
		/*------------------------- Eventos -----------------------------*/
		click_buscar: function() {
			this.form.submit();
		},	
	});
    return {view:ViOrled};
});