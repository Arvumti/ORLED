/**
 * SaveService
 *
 * @description :: servicio para guardar datos
 * @help        :: See http://links.sailsjs.org/docs/services
 */

var url_imgs = '../../assets/images/db_imgs';

module.exports = {
	uploadFiles: function(options) {
		var _req = options.req,
			_res = options.res,
			_params = options.params,
			_definition = options.definition;
			_done = options.done;

		console.log('=== BEGIN PRE UPLOAD ===');
		console.log(_params);
		console.log(_definition);
		console.log('=== END PRE UPLOAD ===');
		var fields = _.filter(_definition, function(obj){ return obj.type == 'file'; });
		//console.log(fields);

		var _files = Object();

		async.eachSeries(
			fields, 
			function (node, callback) {
				// Call to /upload via GET is error
				console.log('=== BEGIN UP ===');
				console.log(node.name);
				if(_req.method === 'GET') {
					console.log('opcion 1');
					callback({errmsg:'GET not allowed', errnum:9501});
				}
				else if(_params[node.name] == 'old'){
					console.log('opcion 2');
					var uploadFile = _req.file(node.name);
					console.log(uploadFile);

					uploadFile.upload({ dirname: url_imgs, maxBytes: 10000000 }, function onUploadComplete(err, files) {
						if (!err && files[0]) {
							console.log(files);
							var file = files[0].fd.split('\\').pop();
							_params[node.name] = file;
							_files[node.name] = file;
						}
						
						callback(err);
					});
				}
				else {
					console.log('opcion 3');
					_params.logo = null;
					callback('');
				}
				console.log('=== END UP ===');
			},
			function (err, files) {
				console.log('finish upload');
				console.log('=== BEGIN POST UPLOAD ===');
				console.log(_params);
				console.log(err);
				console.log(_files);
				console.log('=== END POST UPLOAD ===');


				_done({err:err, files:_files, params:_params});
			}
		);
	},
	uploadFile: function(options) {
		var _req = options.req,
			_res = options.res,
			_done = options.done;

		var uploadFile = _req.file('up_image');
		uploadFile.upload({ dirname: url_imgs, maxBytes: 10000000 }, function onUploadComplete(err, files) {
			var file = '';
			if (!err && files[0]) {
				console.log(files);
				file = files[0].fd.split('\\').pop();
			}
			
			_done({err:err, file:file});
		});
	},
	getParams: function (req) {
		var params = {
			tabla: req.param('tabla'),
			campo: req.param('campo'),
		};
		console.log('=== IN getParams');
		console.log(params);
		console.log('=== IN getParams');

		if(params.data)
			params = JSON.parse(params.data);

		return params;
	}
};