var exports = module.exports;
var cityMap = new Map();
/* Load in a map */
exports.loadMap = (...graph) => {
  graph.map( (route) => {
    route = route.split('');
    city = route[0];
    let neighbor = route[1];
    let distance = parseInt(route[2]);
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
  if(cities.length > 1){
    //attempt to calculate distance to next city
    let next = cities[1];
    let neighborMap = cityMap.get(first)
    let distance = neighborMap.get(next);
    if(distance === undefined){
      return 'NO SUCH ROUTE';
    }
    else{
      //if more cities exist, compute again
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
  else{
    //we are done, and this node is navigating to itself.
    return 0;
  }
}

/* Get the trips between two cities
 * with a maximum or exact number of stops*/
exports.findTrips = (departure, arrival, maxStops, exact, maxDistance, currentStop) => {
  currentStop = currentStop ? currentStop+1 : 1;
  maxStops = maxStops ? maxStops : 10;
  let routes=[];

  if(currentStop > maxStops){
    return [];
  }

  //get all of the direct connections from the departure city
  let connections = cityMap.get(departure);

  for(let [city, distance] of connections){
    if(currentStop!=maxStops){
      let validRoutes = exports.findTrips(city, arrival, maxStops, exact, maxDistance, currentStop);
      if(validRoutes){
        validRoutes.forEach( function (val, i) {
        prefix = currentStop == 1 ? departure + city : city;
        let totalDistance = distance + val[1];
        if(!maxDistance || totalDistance <= maxDistance){
          routes.push([prefix+val[0], distance+val[1]]);
        }
        });
      }
    }
    if((city === arrival) && (!exact || (exact && currentStop == maxStops))){
      if(!maxDistance || distance <= maxDistance){
        routes.push([city, distance]);
      }
    }
  }
  return routes;
}

/*Calculate the shortest distance between two cities*/
exports.getMinTrip = (departure, arrival) => {
  let trips = exports.findTrips(departure, arrival, 5, false);
  trips.sort( function(a,b){ return a[1]-b[1] });
  return trips[0];
}
