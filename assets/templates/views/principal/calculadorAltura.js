var deps = [
	'/js/base/viewsBase.js',
	'text!/templates/views/principal/calculadorAltura.html',
];

define(deps, function (viewsBase, html) {
	/*
		columns: columnas del grid
		model: modelo [opcional]
		pk: primary key
		url: ruta del api
	*/
	var ViCalculadorAltura = Backbone.View.extend({
		el: '#calculadorAltura',
		events: {
			'click .btn-cancelar': 'click_cancelar',
			'click .btn-calcular': 'click_calcular'
		},
		initialize: function(options) {
			//viewsBase.popAbc.prototype.linkFks.call(this);
			this.formData = this.$el.find('.form-data');
			this.tmp_resultado= Handlebars.compile(this.$el.find('.tmp_resultado').html());
			this.gvResultados = this.$el.find('.gv-resultados');
			this.txtLongitud = this.$el.find('[data-field="longitud"]');

			this.datos = {
				rendimiento: 0,
				horas_pico: 0,
			};
		},
		/*------------------------- Base -----------------------------*/
		render: function(txtLongitud, rendimiento, horas_pico) {
			this.datos.rendimiento = parseFloat(rendimiento) * 1000;
			this.datos.horas_pico = horas_pico;

			this.txtLongitud = this.$el.find('[data-field="longitud"]').val(txtLongitud);
			this.$el.foundation('reveal', 'open');
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		william: function(longitud, coeficiente, alturaDes, diametroPulgadas) {
			var Q = this.datos.rendimiento/this.datos.horas_pico/3600;// parseFloat((this.$el.find('[data-field="Q"]').val()));
			var diametroMm = parseFloat((diametroPulgadas*25.4));
			var diametroMetros = parseFloat((diametroMm/1000));
			var V = parseFloat(0.004*Q/Math.PI/Math.pow(diametroMetros,2));
			var H = parseFloat(((6.83*Math.pow((V/coeficiente),1.852))*longitud)/(Math.pow(diametroMetros,1.17)));
			var total = parseFloat(H+alturaDes);
			V = V.toFixed(2);
			H = H.toFixed(2);
			total = total.toFixed(2);
			var resultados = { Q, V, H, total };

			return resultados;		
		},
		manning: function(longitud, coeficiente, alturaDes, diametroPulgadas) {
			var Q = this.datos.rendimiento/1000/this.datos.horas_pico/3600;// parseFloat((this.$el.find('[data-field="Q"]').val()));
			var diametroMm = parseFloat((diametroPulgadas*25.4));
			var diametroMetros = parseFloat((diametroMm/1000));
			
			//10.3*(H12^2)*((G16^2)/(H14^5.33))*H11
			var V = 0;
			var H = parseFloat(10.3*Math.pow(coeficiente, 2)*(Math.pow(Q, 2)/Math.pow(diametroMetros, 5.33))*longitud);
			var total = parseFloat(H+alturaDes);
			H = H.toFixed(2);
			total = total.toFixed(2);
			var resultados = { Q, V, H, total };

			return resultados;
		},
		/*------------------------- Eventos -----------------------------*/
		click_cancelar: function(){
			this.close();
		},
		click_calcular: function() {
			var longitud = parseFloat(this.$el.find('[data-field="longitud"]').val());
			var coeficiente = parseFloat(this.$el.find('[data-field="coeficiente"] option:selected').val());
			var alturaDes = parseFloat((this.$el.find('[data-field="alturaDes"]').val()));
			var diametroPulgadas = parseFloat((this.$el.find('[data-field="diametroPulgadas"] option:selected').val()));
			
			//var diametroMm = this.$el.find('[data-field="diametroMm"]').val();
			//var diametroMetros = this.$el.find('[data-field="diametroMetros"]').val();
			var resultados = this.manning(longitud, coeficiente, alturaDes, diametroPulgadas);
			console.log(resultados);
			//var tr = that.options.parentView.tmp_resultado(resultados);
			this.gvResultados.removeClass('isHidden')
			var tr = this.tmp_resultado(resultados);
	 		this.gvResultados.find('tbody').html(tr);
	 		this.options.parentView.txtAlturaDinamica.val(resultados.total);
		},
	});
	return {view: ViCalculadorAltura, html:html};
});