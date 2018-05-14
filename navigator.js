var exports = module.exports;

//In format [City Name, Map:[Neighbor Name, Distance for edge of (city, neighbor)]]
var cityMap = new Map();
const NO_ROUTE = 'NO SUCH ROUTE';

/* Load in a map */
exports.loadMap = (...graph) => {
  graph.map( (route) => {  //route: "AB5"
    route = route.split('');
    city = route[0]; //"A"
    let neighbor = route[1]; //"B"
    let distance = '';
    for(let i = 2; i < route.length; i++){
      distance+=route[i]; //"5"
    }
    let neighborMap = cityMap.has(city) ? cityMap.get(city) : new Map();
    neighborMap.set(neighbor, parseInt(distance));
    cityMap.set(city, neighborMap);
  })
  console.log(cityMap);
}

/*Compute the distance between two or more cities*/
exports.computeDistance = (...cities)  => {
  //find the list of neighbors of the first city
  let first = cities[0];
	if(first && cityMap.has(first)){
    //attempt to calculate distance to next city
    let next = cities[1];
    let neighborMap = cityMap.get(first);
    let distance = neighborMap.get(next);
    if(!next || first === next){
      return 0; //this is the last city
    }
    else if(distance){
      //if more cities exist, and the current edge is connected, keep a tally and continue.
      cities.shift();
      let add = exports.computeDistance(...cities);
      if(typeof add == 'number'){
        return distance+add;
      }
      else{
        //if type is not a number, we are getting an error which should be returned
        return add;
      }
    }
  }
  //One of the cities either does not exist or is not connected to the first vertex
  return NO_ROUTE;
}

/* Get the trips between two cities
 * with a maximum or exact number of stops*/
exports.findTrips = (departure, arrival, options, currentStop, currentDistance) => {
	currentStop = currentStop+1 || 0;
  currentDistance = currentDistance || 0;
  options = options || {};
  let maxStops = options.maxStops || 10;
  let exact = options.exact  || false;
  let maxDistance = options.maxDistance || Number.POSITIVE_INFINITY;

  let routes=[];
  //get all of the direct connections from the departure city
  let connections = cityMap.get(departure);
  for(let [city, distance] of connections){
    let totalDistance = currentDistance+distance;
    if(currentStop < maxStops && totalDistance < maxDistance){ //not max, free to search more edges.
      if((city === arrival) && (!exact || (exact && currentStop==maxStops-1))){
        routes.push([city, distance]);
      }

      exports.findTrips(city, arrival, options, currentStop, totalDistance).forEach( function (val, i) {
        prefix = currentStop == 0 ? departure + city : city;
        let edgeDistance = distance + val[1];
        if(edgeDistance < maxDistance){
          routes.push([prefix+val[0], edgeDistance]);
        }
      });
    }
  }
  return routes;
}

/*Calculate the shortest distance between two cities*/

//Brute force method: get all the trips, and sort them by distance.
exports.getMinTripBrute = (departure, arrival) => {
  let trips = exports.findTrips(departure, arrival);
  trips.sort( function(a,b){ return a[1]-b[1] });
  return trips[0] || NO_ROUTE;
}

//Dijkstra's algorithm
exports.getMinTripDijkstra = (departure, arrival) => {
  let searchMap = undefined;

	//special case, for coming back to the start node...
	if(departure===arrival){
		arrival='$';
		searchMap = copyMapAddGoal(departure);
	}
	else{
		searchMap = cityMap;
	}

  let cities = searchMap.keys();
	let unvisited = new Map();

  //initialize distances from departure
  for(let cityName of cities){
    unvisited.set(cityName, {
      dist: departure == cityName ? 0 : Number.POSITIVE_INFINITY,
      prev: undefined
    });
  }

	let minTrip = '';
	let distance = 0;

  while(unvisited.size>0){
    let u = getClosest(unvisited);
    let uName = u[0];
    let uDist = u[1].dist;
    let uPrev = u[1].prev;
		//this is the exit condition, we have arrived.
		//to satisfy the conditions of the test, we assume we must take at least
		//one train.  else B->B would be 0.
    if(uName === arrival){
      while(uPrev){
        let firstNode = uName;
        if(uName=='$'){uName=departure;}
				minTrip=uName.concat(minTrip);
        uName = uPrev[0];
        uDist = uPrev[1].dist;
        uPrev=uPrev[1].prev;
        distance+=searchMap.get(uName).get(firstNode);
      }
      minTrip=uName.concat(minTrip);
			if(distance==0){
				return NO_ROUTE;
			}
      return [minTrip,distance];
    }

    unvisited.delete(uName);

    let neighbors = searchMap.get(uName);
    for(let n of neighbors){
      let v = unvisited.get(n[0]);
      if(v){
        let alt = uDist + n[1];
        if(alt < v.dist){
          v.dist = alt;
          v.prev = u;
        }
      }
    }
  }
}

function getClosest(cities){
  let minCity;
  let min = Number.POSITIVE_INFINITY;
  for(let c of cities){
    let city = c[1];
    if(city.dist <= min){
      minCity=c;
      min = city.dist;
    }
  }
 return minCity;
}

//we have to split departure into two nodes:
//original and goal (denoted by $).
//adjacency list updated to point to $ where city = departure.
function copyMapAddGoal(departure){
	let specialMap = new Map();
	//then re-point the nodes.
	for(let city of cityMap){

		let name = city[0];
		//if we don't call new, we'll mutate the master copy of cityMap!
		let neighbors = new Map(city[1]);

		specialMap.set(name, neighbors);

		for(let n of neighbors){
			let nbrName = n[0];
			let nbrDist = n[1];
			if(nbrName == departure){
				neighbors.delete(nbrName);
				neighbors.set('$', nbrDist);
			}
		}
	}

	specialMap.set('$', new Map());
	return specialMap;
}
