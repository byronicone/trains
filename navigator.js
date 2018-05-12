var exports = module.exports;

//In format [City Name, Map:[Neighbor Name, Distance for edge of (city, neighbor)]]
var cityMap = new Map();

/* Load in a map */
exports.loadMap = (...graph) => {
  graph.map( (route) => {  //route: "AB5"
    route = route.split('');
    city = route[0]; //"A"
    let neighbor = route[1]; //"B"
    let distance = parseInt(route[2]); //"5"
    let neighborMap = cityMap.has(city) ? cityMap.get(city) : new Map();
    neighborMap.set(neighbor, distance);
    cityMap.set(city, neighborMap);
  })
  console.log(cityMap);
}

/*Compute the distance between two or more cities*/
exports.computeDistance = (...cities)  => {
  //find the list of neighbors of the first city
  let first = cities[0];
  if(first){
    //attempt to calculate distance to next city
    let next = cities[1];
    let neighborMap = cityMap.get(first);
    let distance = neighborMap.get(next);
    if(!next){
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
  return 'NO SUCH ROUTE';
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
    if(currentStop < maxStops && totalDistance <= maxDistance){ //not max, free to search more edges.
      if((city === arrival) && (!exact || (exact && currentStop==maxStops-1))){
        routes.push([city, distance]);
      }

      exports.findTrips(city, arrival, options, currentStop, totalDistance).forEach( function (val, i) {
        prefix = currentStop == 0 ? departure + city : city;
        let edgeDistance = distance + val[1];
        if(edgeDistance <= maxDistance){
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
  return trips[0] || 'NO SUCH ROUTE';
}

//Dijkstra's algorithm
exports.getMinTripDijkstra = (departure, arrival) => {
  let cities = cityMap.keys();
  let unvisited = new Map();
  let minTrip = '';
  let distance = 0;
  //initialize distances from departure
  for(let cityName of cities){
    unvisited.set(cityName, {
      dist: departure == cityName ? 0 : Number.POSITIVE_INFINITY,
      prev: undefined
    });
  }
  while(unvisited.size>0){
    let u = getClosest(unvisited);
    let uName = u[0];
    let uDist = u[1].dist;
    let uPrev = u[1].prev;

    if(uName === arrival){
      while(uPrev){
        let firstNode = uName;
        minTrip=uName.concat(minTrip);
        uName = uPrev[0];
        uDist = uPrev[1].dist;
        uPrev=uPrev[1].prev;
        distance+=cityMap.get(uName).get(firstNode);
      }
      minTrip=uName.concat(minTrip);
      return [minTrip,distance];
    }
    unvisited.delete(uName);

    let neighbors = cityMap.get(uName);
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
