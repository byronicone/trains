const assert = require('assert');
const nav= require('../navigator');

describe('trains', () => {
  //Graph AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
  nav.loadMap('AB5','BC4','CD8','DC8','DE6','AD5','CE2','EB3','AE7');
  it('returns 0 if only one city is passed', () => {
    assert.equal(0,nav.computeDistance('A'));
  })
  it('computes distance of route A-B-C', () => {
    assert.equal(9,nav.computeDistance('A','B','C'));
  })
  it('computes distance of route A-D', () => {
    assert.equal(5,nav.computeDistance('A','D'));
  })
  it('computes distance of route A-D-C', () => {
    assert.equal(13,nav.computeDistance('A','D','C'));
  })
  it('computes distance of route A-E-B-C-D', () => {
    assert.equal(22,nav.computeDistance('A','E','B','C','D'));
  })
  it('computes distance of route A-E-D', () => {
    assert.equal('NO SUCH ROUTE',nav.computeDistance('A','E','D'));
  })
  it('finds number of trips from C to C with a max of 3 stops', () => {
    let trips = nav.findTrips('C','C', 3);
    console.log(trips);
    assert.equal(trips.length,2);
  })
  it('finds number of trips from A to C with exactly 4 stops', () => {
    let trips = nav.findTrips('A', 'C', 4, true);
    console.log(trips);
    assert.equal(trips.length, 3);
  })
  it('calculates shortest distance from A to C', () => {
    let minTrip = nav.getMinTrip('A','C');
    console.log(minTrip);
    assert.equal(minTrip[1],9);
  })
  it('calculates shortest distance from B to B', () => {
    let minTrip= nav.getMinTrip('B','B');
    console.log(minTrip);
    assert.equal(minTrip[1],9);
  })
  it('determines number of unique routes from C to C with a distance less than 30', () => {
   let trips = nav.findTrips('C','C',10,false,30);
    console.log(trips);
    assert.equal(trips.length,9);
  })

})
