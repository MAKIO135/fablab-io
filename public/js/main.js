$( document ).ready(function() {

	var socket = io.connect( 'http://156.18.52.2/' );

	socket.on( 'connected', function ( data ) {
		console.log( data );
	} );
	///////////////////////////////////////////////////////////////////
	/*
			    _       ______              
			   (_)___  / ____/___ _____ ___ 
			  / / __ \/ /   / __ `/ __ `__ \
			 / / /_/ / /___/ /_/ / / / / / /
			/_/ .___/\____/\__,_/_/ /_/ /_/ 
			 /_/                                         
	*/
		$( '#getCapture' ).click( function() {
			socket.emit( 'getCapture', {} );
			$('#loader').show().animate({"width":"100%"}, 10000, function(){
				$('#loader').hide();
				$( '#getCapture' ).hide();
				$('#ipcamera1').show();
				$('#ipcamera2').show();
			});
		} );

	///////////////////////////////////////////////////////////////////
	/*
		    ___             __      _                __  ___   ______ 
		   /   |  _________/ /_  __(_)___  ____     / / / / | / / __ \
		  / /| | / ___/ __  / / / / / __ \/ __ \   / / / /  |/ / / / /
		 / ___ |/ /  / /_/ / /_/ / / / / / /_/ /  / /_/ / /|  / /_/ / 
		/_/  |_/_/   \__,_/\__,_/_/_/ /_/\____/   \____/_/ |_/\____/  
		    _______                            __       
		   / ____(_)________ _____ ___  ____ _/ /_____ _
		  / /_  / / ___/ __ `/ __ `__ \/ __ `/ __/ __ `/
		 / __/ / / /  / /_/ / / / / / / /_/ / /_/ /_/ / 
		/_/   /_/_/   \__,_/_/ /_/ /_/\__,_/\__/\__,_/  

	*/

		$( '#on' ).click( function() {
			socket.emit('ledCommand', { command: 'on' } );
		} );
		$( '#off' ).click(function() {
			socket.emit('ledCommand', { command: 'off' } );
		} );
		///////////////////////////////////////////////
		function map(value, istart, istop, ostart, ostop) {
			return ostart + ( ostop - ostart ) * ( ( value - istart ) / ( istop - istart ) );
		}

		function ease( variable, target, easingVal ) {
			var d = target - variable;
			if( Math.abs( d ) > 1 ) variable += d * easingVal;
			return variable;
		}

		var width = $( "#ref").width();
		var cnvs = document.getElementById( 'cnvs' );
		cnvs.width = width;
		cnvs.height = 300;

		var y = 0, potarValue = 0;
		var ctx = cnvs.getContext( '2d' );
		ctx.fillStyle = "#111";
		ctx.fillRect( 0, 0, width, cnvs.height );

		socket.on( 'potar', function ( data ) {
			potarValue = data.value;
		} );

		function render(){
			ctx.fillStyle = "#111";
			ctx.fillRect( 0, 0, width, cnvs.height );

			ctx.fillStyle = "#33c3f0";
			y = ease( y, map( potarValue, 0, 1024, 0, 300 ), 0.1 );
			ctx.fillRect( 0, y, width, cnvs.height );
		}
		///////////////////////////////////////////////
		socket.on( 'temp', function( data ) {
			var temperature = Math.round( ( ( ( data.value / 1024 ) * 5 ) - 0.5 ) * 10000 ) / 100 - 5;
			$( '#temp' ).text( temperature );
		} );
		///////////////////////////////////////////////
		function update(){
			socket.emit( 'getTemp', { } );
			socket.emit( 'getPotar', { } );
			render();
			window.requestAnimationFrame( update );
		}
		update();
	///////////////////////////////////////////////////////////////////
	/*
		                                         __    _      __    __
		   ________  ____  _________  __________/ /_  (_)__  / /___/ /
		  / ___/ _ \/ __ \/ ___/ __ \/ ___/ ___/ __ \/ / _ \/ / __  / 
		 (__  )  __/ / / (__  ) /_/ / /  (__  ) / / / /  __/ / /_/ /  
		/____/\___/_/ /_/____/\____/_/  /____/_/ /_/_/\___/_/\__,_/   
		                                                              
	*/
		var sensorshield;
		socket.on( 'sensorshield', function( data ){
			sensorshield = JSON.parse( data.data );
			// console.log( sensorshield );
			var light = Math.round( sensorshield.light / 1023 * 255 );
			$( '#sensorlight' ).css( "background-color", "rgba(" + light + "," + light + ","+ light + ", 1 )" )

			for (var i = 0; i < sensorshield.buttons.length; i++) {
				var btnid = "#sensorbtn" + i;
				if( sensorshield.buttons[i] === 0 ) $(btnid).removeClass('off');
				else $(btnid).addClass('off');
			};

			for (var i = 0; i < sensorshield.switches.length; i++) {
				var swtchid = "#sensorswitch" + i;
				if( sensorshield.switches[i] === 0 ) $(swtchid).removeClass('off');
				else $(swtchid).addClass('off');
			};

			for (var i = 0; i < sensorshield.sliders.length; i++) {
				var sliderid = "#sensorslider" + i;
				$(sliderid).css( "width", Math.round( sensorshield.sliders[i] / 1023 * 100 ) + "%" );
			};
		} );
	///////////////////////////////////////////////////////////////////
	/*
		   _____                  __     _     
		  / ___/____  ____ ______/ /__  (_)___ 
		  \__ \/ __ \/ __ `/ ___/ //_/ / / __ \
		 ___/ / /_/ / /_/ / /  / ,< _ / / /_/ /
		/____/ .___/\__,_/_/  /_/|_(_)_/\____/ 
		    /_/                                
	*/
		var sparkLeds = [0,0,0];
		socket.on( 'sparkRelayConnected', function(data){
			$("#sparkLedOn").text("True");
			console.log(data.data);
			setLeds(data.data);
		} );
		
		function setLeds(){
			for (var i = 0; i < sparkLeds.length; i++) {
				sparkLeds[i] = sparkLeds[i];
				if(sparkLeds[i] === 0){
					$("#led"+i).removeClass('on').addClass('off');
				}
				else {
					$("#led"+i).removeClass('off').addClass('on');
				}
			};
		}

		for (var i = 0; i < sparkLeds.length; i++) {
			$('#led'+i).click( function(){
				sparkLeds[i] = 1-sparkLeds[i];
				toggleLed(i);
				setLeds();
			} );
		};
		/*
			$('#led0').click( function(){
				sparkLeds[0] = 1-sparkLeds[0];
				toggleLed(0);
				setLeds();
			} );
			$('#led1').click( function(){
				sparkLeds[1] = 1-sparkLeds[1];
				toggleLed(1);
				setLeds();
			} );
			$('#led2').click( function(){
				sparkLeds[2] = 1-sparkLeds[2];
				toggleLed(2);
				setLeds();
			} );
		*/

		function toggleLed(id){
			if( id === 0 ){
				socket.emit('setLed', { led: "yellow" } );
			}
			else if( id == 1 ){
				socket.emit('setLed', { led: "green" } );
			}
			else if( id == 2 ){
				socket.emit('setLed', { led: "blue" } );
			}
		}

		///////////////////////////////////////////////////////////////////
		
		var sparkRelays = [0,0,0];
		socket.on( 'sparkLedsConnected', function(data){
			$("#sparkRelayOn").text("True");
			console.log(data.data);
			for (var i = 0; i < data.data.length; i++) {
				sparkRelays = data.data[i];
			};
		} );

		for (var i = 0; i < 4; i++) {
			$('#relay'+i).click(function(){
				sparkRelays[i] = 1 - sparkRelays[i];
				toggleRema
			});
		};

} );