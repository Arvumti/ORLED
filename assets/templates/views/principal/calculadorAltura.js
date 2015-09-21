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
	var ViCalculadorAltura = viewsBase.popAbc.extend({
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
		},
		/*------------------------- Base -----------------------------*/
		render: function() {
			debugger
			viewsBase.base.prototype.render.call(this);
			this.$el.foundation('reveal', 'open');
		},
		close: function() {
			this.$el.foundation('reveal', 'close');
		},
		/*------------------------- Eventos -----------------------------*/
		click_cancelar: function(){
			this.close();
		},
		click_calcular: function(){
			debugger
			var that = this;
			var longitud = parseFloat(this.$el.find('[data-field="longitud"]').val());
			var coeficiente = parseFloat(this.$el.find('[data-field="coeficiente"]').val());
			var alturaDes = parseFloat((this.$el.find('[data-field="alturaDes"]').val()));
			var Q = parseFloat((this.$el.find('[data-field="Q"]').val()));
			//var diametroMm = this.$el.find('[data-field="diametroMm"]').val();
			//var diametroMetros = this.$el.find('[data-field="diametroMetros"]').val();
			var diametroPulgadas = parseFloat((this.$el.find('[data-field="diametroPulgadas"]').val()));
			var diametroMm = parseFloat((diametroPulgadas*25.4));
			var diametroMetros = parseFloat((diametroMm/1000));
			var V = parseFloat(0.004*Q/Math.PI/Math.pow(diametroMetros,2));
			var H = parseFloat(((6.83*Math.pow((V/coeficiente),1.852))*longitud)/(Math.pow(diametroMetros,1.17)));
			var total = parseFloat(H+alturaDes);
			V = V.toFixed(2);
			H = H.toFixed(2);
			total = total.toFixed(2);
			var resultados = {
				Q,
				V,
				H,
				total,
			}
			console.log(resultados);
			//var tr = that.options.parentView.tmp_resultado(resultados);
			this.gvResultados.removeClass('isHidden')
			var tr = that.tmp_resultado(resultados);
	 		that.gvResultados.find('tbody').html(tr);

		},
	});
	return {view: ViCalculadorAltura, html:html};
});