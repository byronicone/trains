var EventEmitter = require('events');
var prompt = new EventEmitter();
var current = null;
var cities = null;
var options = {};
var result = {};
process.stdin.resume();

var navigator = require('./navigator');

process.stdin.on('data', function(data){
  prompt.emit(current, data.toString().replace(/\s/g,''));
});

prompt.on(':new', function(name, question){
  current = name;
	console.log(question);
	process.stdout.write('> ');
});

prompt.on(':result', function(){
  console.log('\n', result);
	if(result == 'quit'){
		process.stdin.pause();
	}
	else{
		prompt.emit('graph', -1);
	}
});

prompt.emit(':new', 'graph', '\nPlease enter a comma delimited list of edges to represent a railroad network.'
													+'\nExample: XY5, YZ2, ZX1'
													+'\n\nInput: ');

prompt.on('graph', function(data){
	if(data != -1){ //-1 indicates the navigator has already loaded a map.
		data=data.split(',');
		console.log(data);
		navigator.loadMap(...data);
	}
  prompt.emit(':new', 'options', '\n1. Compute distance of an intercity route.'
															+'\n2. Find possible trips between cities.'
															+'\n3. Discover shortest route between cities'
															+'\n\nInput: ');
});

prompt.on('options', function(data){
	data=parseInt(data);
	if([1,2,3].includes(data)){
  	switch(data){
			case 1: prompt.emit(':new', 'route', '\nEnter the city names of the route to be measured.'
														  +'\nExample: X,Y,Z'
																+'\n\nInput: ');
				break;
			case 2: prompt.emit(':new', 'trips1', '\nEnter two city names to find all trips.'
														  	+'\nExample: X,Y:'
																+'\n\nInput: ');
				break;
			case 3: prompt.emit(':new', 'shortest', '\nEnter two city names to find the shortest route.'
														  +'\nExample: X,Y'
																+'\n\nInput: ');
				break;
		}
	}
	else{
		console.log('\nInvalid input! See example and try again.');
		prompt.emit('graph', -1); //retry for input
	}
});

prompt.on('route', function(data){
	if(data != -1){ //-1 indicates a retry of a failed input.
	  data=data.split(',');
		result = navigator.computeDistance(...data);
		prompt.emit(':result');
	}
});

prompt.on('trips1', function(data){
	if(data != -1){ //-1 indicates a retry of a failed input.
	  cities=data.split(',');
	}
	prompt.emit(':new', 'trips2', '\nMaximim number of stops?'
																+'\n\nInput: (enter for default: 10)');
});

prompt.on('trips2', function(data){
	options.maxStops = data || 10;
	prompt.emit(':new', 'trips3', '\nMaximum distance?'
																+'\n\nInput: (enter for default: Infinity)');
});

prompt.on('trips3', function(data){
	options.maxDistance = data || undefined;
	if(cities){
		result = navigator.findTrips(...cities,options);
		prompt.emit(':result');
	}
	else{
		console.log('\nInvalid input! See example and try again.');
		prompt.emit('graph', -1); //retry for input
	}
});

prompt.on('shortest', function(data){
	if(data != -1){ //-1 indicates a retry of a failed input.
	  data=data.split(',');
		result = navigator.getMinTripDijkstra(...data);
		prompt.emit(':result');
	}
});
