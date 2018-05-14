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

function init(){
  prompt.emit(':new', 'graph', '\nPlease enter a comma delimited list of edges to represent a railroad network.'
			    +'\nExample: AB5, BC2, CA1'
			    +'\n\nInput: ');
}

prompt.on('graph', function(data){
	if(data != -1){ //-1 indicates the navigator has already loaded a map.
		data=data.split(',');
		navigator.loadMap(...data);
	}
  prompt.emit(':new', 'options', '\n1. Run the Thoughtworks test suite.'
				+'\n2. Compute distance of an intercity route.'
				+'\n3. Find possible trips between cities.'
				+'\n4. Discover shortest route between cities.'
				+'\n5. Enter a new data set.'
				+'\n\nInput: ');
});

prompt.on('options', function(data){
	data=parseInt(data);
	if([1,2,3,4,5].includes(data)){
  	switch(data){
	case 1: prompt.emit('test');
		break;
	case 2: prompt.emit(':new', 'route', '\nEnter the city names of the route to be measured.'
					    +'\nExample: A,B,C'
					    +'\n\nInput: ');
		break;
	case 3: prompt.emit(':new', 'trips1', '\nEnter two city names to find all trips.'
					      +'\nExample: A,B:'
					      +'\n\nInput: ');
		break;
	case 4: prompt.emit(':new', 'shortest', '\nEnter two city names to find the shortest route.'
					      +'\nExample: A,B'
					      +'\n\nInput: ');
		break;
	case 5: init();
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

prompt.on('test', function(){
  console.log('\nOutput #1: ' + navigator.computeDistance('A','B','C'));
  console.log('Output #2: ' + navigator.computeDistance('A','D'));
  console.log('Output #3: ' + navigator.computeDistance('A','D','C'));
  console.log('Output #4: ' + navigator.computeDistance('A','E','B','C','D'));
  console.log('Output #5: ' + navigator.computeDistance('A','E','D'));
  console.log('Output #6: ' + navigator.findTrips('C','C',{maxStops:3}).length);
  console.log('Output #7: ' + navigator.findTrips('A','C',{maxStops:4,exact:true}).length);
  console.log('Output #8: ' + navigator.getMinTripDijkstra('A','C')[1]);
  console.log('Output #9: ' + navigator.getMinTripDijkstra('B','B')[1]);
  console.log('Output #10: ' + navigator.findTrips('C','C',{maxDistance:30}).length);
  prompt.emit('graph',-1);
})

init();
