/*
	    ______                              
	   / ____/  ______  ________  __________
	  / __/ | |/_/ __ \/ ___/ _ \/ ___/ ___/
	 / /____>  </ /_/ / /  /  __(__  |__  ) 
	/_____/_/|_/ .___/_/   \___/____/____/  
	          /_/                           
*/
var express = require( 'express' )
var app = express(), 
	server = require( 'http' ).createServer( app );

// Access server through port 80
server.listen( 80 );

// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use( express.static( __dirname + '/public' ) );

// Set index.html as the base file
app.get( '/', function ( req, res ) {
	res.sendFile( __dirname + '/index.html' );
});


/*
	   _____ ____  ________ __ ____________   ________ 
	  / ___// __ \/ ____/ //_// ____/_  __/  /  _/ __ \
	  \__ \/ / / / /   / ,<  / __/   / /     / // / / /
	 ___/ / /_/ / /___/ /| |/ /___  / /  _ _/ // /_/ / 
	/____/\____/\____/_/ |_/_____/ /_/  (_)___/\____/  
	                                                   
*/
var io = require( 'socket.io' ).listen( server );
var connectCounter = 0;

io.sockets.on( 'connection' , function ( socket ) {
	// connection
	connectCounter++;
	console.log("clients: " + connectCounter);
	socket.emit( 'connected', { data: 'Connected' } );

	if(sp){
		sp.write( "1\n", function(err, results) {
			console.log("sent");
			if(err) console.log('err ' + err);
			// console.log('results ' + results);
		} );
	}

	//deconnection
	socket.on('disconnect', function() {
		connectCounter--;
		console.log("clients: " + connectCounter);
		if(sp && connectCounter==0){
			sp.write( "0\n", function(err, results) {
				console.log("sent");
				if(err) console.log('err ' + err);
				// console.log('results ' + results);
			} );
		}
	});


	//////////////////////////////////////////
	socket.on( 'getCapture', function(){
		if(sp){
			sp.write( "2\n", function(err, results) {
				console.log("sent");
				if(err) console.log('err ' + err);
				// console.log('results ' + results);
			} );
		}
	} );
	
	/*
	//////////////////////////////////////////
	if( FabRelay !== null ) socket.emit( 'sparkRelayConnected', {data: sparkLeds} );
	if( fabCoreUfl !== null ) socket.emit( 'sparkLedsConnected', {data: sparkRelays} );
	//////////////////////////////////////////
	socket.on( 'ledCommand', function ( data ) {
		// console.log( data );
		var command = data.command;
		if ( command === 'on' ) {
			led.on();
		}
		else if ( command === 'off' ) {
			led.off();
		}
	} );

	socket.on( 'getPotar', function(data){
		socket.emit( 'potar', { value: potarValue } );
	} );

	socket.on( 'getTemp', function(data){
		socket.emit( 'temp', { value: tempValue } );
	} );
	//////////////////////////////////////////
	socket.on( 'setLed', function( data ){
		// console.log(data);			
		if(fabCoreUfl !== null){
			fabCoreUfl.callFunction( data.led, '0', function(err, data){
				if(err){
					console.log( 'An error occurred:', err );
				}
				else{
					console.log( 'Function called succesfully:', data );
					io.sockets.emit( 'ledToggled', { led: data.return_value} )
				}
			} );
		}
	} );
	*/

	/*socket.on( '', function(){
	} );*/
} );


/*
	   _____           _       ______             __ 
	  / ___/___  _____(_)___ _/ / __ \____  _____/ /_
	  \__ \/ _ \/ ___/ / __ `/ / /_/ / __ \/ ___/ __/
	 ___/ /  __/ /  / / /_/ / / ____/ /_/ / /  / /_  
	/____/\___/_/  /_/\__,_/_/_/    \____/_/   \__/  
	                                                 
*/
	// Currently incompatible alongside JohnnyFive... needs review
	
	var serialport = require( "serialport" );
	serialport.list(function (err, ports) {
		ports.forEach(function(port) {
			console.log(port.comName);
			console.log(port.pnpId);
			console.log(port.manufacturer);
		});
	});

	var SerialPort = serialport.SerialPort;

	// var sp = new SerialPort( "/dev/ttyACM0", { baudrate: 9600, parser: serialport.parsers.readline("\n") } );
	var sp = new SerialPort( "COM19", { baudrate: 9600, parser: serialport.parsers.readline("\n") } );

	sp.on("open", function () {
		console.log( 'serialport open' );

		sp.on('data', function(data) {
			// console.log( data );
			io.sockets.emit( 'sensorshield', { data: data } );
		} );

	} );


/*
	   _____                  __   ______              
	  / ___/____  ____ ______/ /__/ ____/___  ________ 
	  \__ \/ __ \/ __ `/ ___/ //_/ /   / __ \/ ___/ _ \
	 ___/ / /_/ / /_/ / /  / ,< / /___/ /_/ / /  /  __/
	/____/ .___/\__,_/_/  /_/|_|\____/\____/_/   \___/ 
	    /_/                                            
*/
/*
var spark = require( 'spark' );
var fabCoreUfl = null,
	FabRelay = null,
	sparkLeds = [0,0,0,0],
	sparkRelays = [0,0,0];

spark.on( 'login', function(err, body) {
	console.log( 'API call completed on Login event:', body );
	
	var devicesPr = spark.listDevices();
	devicesPr.then(
		function( devices ){
			// console.log( 'Devices: ', devices );
			if( devices.length > 0 ){
				for (var i = 0; i < devices.length; i++) {

					if( devices[ i ].attributes.name === "FabRelay" ){
						if(devices[ i ].attributes.connected){
						console.log( devices[ i ].attributes.name + " connected: " + devices[ i ].attributes.connected );
							io.sockets.emit( 'sparkRelayConnected', {data: sparkRelays} );
							FabRelay = devices[ i ];
							FabRelay.callFunction( 'reset', '0',function(err, data) {
								if (err) {
									console.log( 'An error occurred:', err );
								} else {
									console.log( 'Function called succesfully:', data );
								}
							} );
						}
					}
					
					else if( devices[ i ].attributes.name === "fabCoreUfl" ){
						if(devices[ i ].attributes.connected){
						console.log( devices[ i ].attributes.name + " connected: " + devices[ i ].attributes.connected );
							io.sockets.emit( 'sparkLedsConnected', {data: sparkLeds} );
							fabCoreUfl = devices[ i ];
							fabCoreUfl.callFunction( 'reset', '0',function(err, data) {
								if (err) {
									console.log( 'An error occurred:', err );
								} else {
									console.log( 'Function called succesfully:', data );
								}
							} );
						}
					}
				}
			}
		},
		function(err) {
			console.log('List devices call failed: ', err);
		}
	);
} );
spark.login( { accessToken: '9a141fdd24521c467b3f214f62b4de1d4a50c58b' } );
*/