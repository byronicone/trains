const assert = require('assert');
const nav= require('../navigator');

describe('trains', () => {
  //Graph AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
  nav.loadMap('AB5','BC4','CD8','DC8','DE6','AD5','CE2','EB3','AE7');
  it('computes distance of route A-B-C', () => {
  })
  it('computes distance of route A-D', () => {
  })
  it('computes distance of route A-D-C', () => {
  })
  it('computes distance of route A-E-B-C-D', () => {
  })
  it('computes distance of route A-E-D', () => {
  })
  it('finds number of trips from C to C with a max of 3 stops', () => {
  })
  it('finds number of trips from A to C with exactly 4 stops', () => {
  })
  it('calculates shortest distance from A to C', () => {
  })
  it('calculates shortest distance from B to B', () => {
  })
  it('determines number of unique routes from C to C with a distance less than 30', () => {
  })

})
