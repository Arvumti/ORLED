var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
	console.log('serializeUser');
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log('deserializeUser');
	done(null, user);
});

passport.use(new LocalStrategy({
	usernameField: 'user',
	passwordField: 'pass'
	},
	function(user, pass, done) {
		console.log('passport.use', user, pass);

        Usuarios.findOne({usuario:user, contrasenia:pass}, function(err, usuario) {
            console.log('err: ', err, ' usuario: ', usuario);

            var errmsg = '',
                errnum = 0;

            if(!usuario) {
                errmsg = 'Usuario y/o contraseña no validos';
                errnum = 5000;
            }

            return done(null, {usuario:usuario, errmsg:errmsg, errnum:errnum});
        });
	}
));