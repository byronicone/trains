var exports = module.exports;
var cityMap = new Map();
/* Load in a map */
exports.loadMap = (...graph) => {
  graph.map( (route) => {
    route = route.split('');
    console.log(route);
    city = route[0];
    let neighbor = route[1];
    let distance = route[2];
    let neighborMap = cityMap.has(city) ? cityMap.get(city) : new Map();
    neighborMap.set(neighbor, distance);
    cityMap.set(city, neighborMap);
  })
  console.log(cityMap);
}

/*Compute the distance between two or more cities*/
exports.computeDistance = (cities)  => {
}

/*Compute the number of trips between two cities
 * optionally require a maximum or exact number of stops*/
exports.findNumTrips = (cities) => {
}

/*Calculate the shortest distance between two cities*/
exports.getMinDistance = (cities) => {
}

/*Determine the number of unique routes between two cities
 * optionally require a maximum distance */

