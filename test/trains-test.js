const assert = require('assert');
const nav= require('../navigator');
const NO_ROUTE = 'NO SUCH ROUTE';

describe('trains', () => {
  //Graph AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
  nav.loadMap('AB5','BC4','CD8','DC8','DE6','AD5','CE2','EB3','AE7');
    it('computes distance of route A-B-C', () => {
    assert.equal(nav.computeDistance('A','B','C'),9);
  })
  it('computes distance of route A-D', () => {
    assert.equal(nav.computeDistance('A','D'),5);
  })
  it('computes distance of route A-D-C', () => {
    assert.equal(nav.computeDistance('A','D','C'),13);
  })
  it('computes distance of route A-E-B-C-D', () => {
    assert.equal(nav.computeDistance('A','E','B','C','D'),22);
  })
  it('computes distance of nonexistent route A-E-D', () => {
    assert.equal(nav.computeDistance('A','E','D'),NO_ROUTE);
  })
  it('finds number of trips from C to C with a max of 3 stops', () => {
    let options = {};
    options.maxStops=3;
    let trips = nav.findTrips('C','C',options);
    console.log(trips);
    assert.equal(trips.length,2);
  })
  it('finds number of trips from A to C with exactly 4 stops', () => {
    let options = {};
    options.maxStops = 4;
    options.exact = true;
    let trips = nav.findTrips('A', 'C', options);
    console.log(trips);
    assert.equal(trips.length, 3);
  })
  it('calculates shortest distance from A to C', () => {
    let minTrip = nav.getMinTripDijkstra('A','C');
    console.log(minTrip);
    assert.equal(minTrip[1],9);
  })
  it('calculates shortest distance from B to B', () => {
    let minTrip= nav.getMinTripDijkstra('B','B');
    console.log(minTrip);
    assert.equal(minTrip[1],9);
  })
  it('determines number of unique routes from C to C with a distance less than 30', () => {
    let options = {};
    options.maxDistance=30;
    let trips = nav.findTrips('C','C',options);
    console.log(trips);
    assert.equal(trips.length,7);
  })
  it('returns 0 if only one city is passed', () => {
    assert.equal(nav.computeDistance('A'),0);
  })
  it('returns NO SUCH ROUTE if invalid city is passed', () => {
    assert.equal(nav.computeDistance('AD'),NO_ROUTE);
  })
  it('returns NO SUCH ROUTE if any city is not in the map', () => {
    assert.equal(nav.computeDistance('A','X'),NO_ROUTE);
  })
  it('returns NO SUCH ROUTE if blank input', () => {
    assert.equal(nav.computeDistance(),NO_ROUTE);
  })
  it('returns NO SUCH ROUTE if city is unreachable:', () =>{
    assert.equal(nav.getMinTripDijkstra('C','A'), NO_ROUTE);
  })
  it('calculates the shortest distance from C to B', () =>{
    assert.equal(nav.getMinTripDijkstra('C','B')[1], 5);
  })
});
