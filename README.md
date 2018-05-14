# trains

## Instructions for Interviewer  
Hello there!  Hope you enjoy my code and tests.  Here's how to run it.  
  
1. Install node.js and npm.  
2. Navigate to the root of the project.  You should be on the same level as index.js and navigator.js.  
3. Run `npm start`  
4. Type/paste in the sample data set (i.e. AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7)  
5. Input `1` to run the tests specified in the problem statement.    
6. To play around further (and see the actual routes between cities) use options `2-4`.  
7. Option `5` will allow a new data set to be entered so you can re-run the tests.  
  
To run my test suite from the root of the project:  
1. Run `npm install mocha`  
2. Run `npm test`  
  
## Design Asssumptions & Considerations
1. **I used Javascript's built-in Map to model a graph of vertices**    
The values of vertex, edge, and weight (distance) were simple enough to not require extraneous code.  Should the problem get more complex - requiring descriptions of towns, special considerations for a subset of routes, etc - it may be worth creating unique objects like City (vertex) and Route (edge/weight) but nothing in this problem anticipates that.  I prefer to keep a simple MVP oriented approach.  
  
2. **For modeling the neighborMap I used an adjacency list**  
I debated between this and adjacency matrix.  In my opinion the matrix has too large a storage cost at O(n^2) to justify the time savings of adding/removing edges (which is not a part of the problem statement anyway). 

3.  **I chose an arbitary limit of 10 stops to bound findTrips**  
Test #11 seems to indicate that there are an infinite number of routes.  In practice, I would suggest that this code stop searching when the arrival city is reached, but seeing as this would break the test result here I did not implement it that way.    

4.  **For finding possible trips, I used a breadth-first search of the graph**
This is implemented by recursively searching the neighbors of the current "departure" node and terminating the search when one of two conditions occurs:  we reach the max number of stops (default of 10) OR the maximum distance for a route. Any time the "arrival" node is being examined, we add a route to the result set.  As mentioned before, this would be the exit condition in a production scenario in my opinion, but to accomodate the test results I used the optional max limits instead.

5. **Two algorithms for finding shortest possible route: 1 brute force sorting algorithm, and 1 implementation of Dijkstra's algorithm**
The sorting will work for a small data set with little penalty.  The more verbose Dijkstra algorithm is explained here, with pseudocode which I have followed https://en.wikipedia.org/wiki/Dijkstra's_algorithm.

  
### TODO
If I had more time, I'd do the following:  
*Model the graph as a set of classes instead of using Map  
*Refactor Dijkstra algorithm to be less verbose and include more helpers  
*Make the input a little more robust (or build a UI)  
  
## Problem Statement 
The local commuter railroad services a number of towns in Kiwiland.  Because of monetary concerns, all of the tracks are 'one-way.'  That is, a route from Kaitaia to Invercargill does not imply the existence of a route from Invercargill to Kaitaia.  In fact, even if both of these routes do happen to exist, they are distinct and are not necessarily the same distance!
 
Input:  A directed graph where a node represents a town and an edge represents a route between two towns.  The weighting of the edge represents the distance between the two towns.  A given route will never appear more than once, and for a given route, the starting and ending town will not be the same town.  Sample: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
 
Output: For test input 1 through 5, if no such route exists, output 'NO SUCH ROUTE'.  Otherwise, follow the route as given; do not make any extra stops!  For example, the first problem means to start at city A, then travel directly to city B (a distance of 5), then directly to city C (a distance of 4).  
