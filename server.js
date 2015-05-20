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

io.sockets.on( 'connection' , function ( socket ) {
	socket.emit( 'connected', { data: 'Connected' } );
	/*
	if( FabRelay !== null ) socket.emit( 'sparkRelayConnected', {data: sparkLeds} );
	if( fabCoreUfl !== null ) socket.emit( 'sparkLedsConnected', {data: sparkRelays} );

	//////////////////////////////////////////
	socket.on( 'getCapture', function(){
		camera.start();
	} );
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