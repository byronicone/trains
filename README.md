# trains
## Problem Statement 
The local commuter railroad services a number of towns in Kiwiland.  Because of monetary concerns, all of the tracks are 'one-way.'  That is, a route from Kaitaia to Invercargill does not imply the existence of a route from Invercargill to Kaitaia.  In fact, even if both of these routes do happen to exist, they are distinct and are not necessarily the same distance!
 
Input:  A directed graph where a node represents a town and an edge represents a route between two towns.  The weighting of the edge represents the distance between the two towns.  A given route will never appear more than once, and for a given route, the starting and ending town will not be the same town.  Sample: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
 
Output: For test input 1 through 5, if no such route exists, output 'NO SUCH ROUTE'.  Otherwise, follow the route as given; do not make any extra stops!  For example, the first problem means to start at city A, then travel directly to city B (a distance of 5), then directly to city C (a distance of 4).  (See tests in trains-test.js)  
  
## Design Asssumptions & Considerations
1. I used Javascript's built-in Map to model a graph of vertices with adjacency lists.  The values of vertex, edge, and weight (distance) were simple enough to not require extraneous code.  Should the problem get more complex - requiring descriptions of towns, special considerations for a subset of routes, etc - it may be worth creating unique objects like City (vertex) and Route (edge/weight) but nothing in this problem anticipates that.  I prefer to keep a simple MVP oriented approach.  
  
2.  For modeling the key/value or neighborMap, I debated between an adjacency matrix vs adjacency list.  In my opinion the former has too large a storage cost at O(n^2) to justify the time savings of adding/removing edges (which is not a part of the problem statement anyway).  I nested a second Map ( of neighborName, neighborDistance) in the value of cityMap's keys to model an adjacency list.

3.  Test #11 seems to indicate that there are an infinite number of routes.  There are several circular routes that repeat themselves.  To avoid the problem of infinite loops, I chose an arbitrary limit of 10 stops to bound the search.  In practice, I would suggest that this code stop searching when the arrival city is reached, but seeing as this would break the test result here I did not implement it that way.  
  
### TODO
-Add method to add routes instead of doing it inline (for clarity)  
-use push instead of replacing whole map for modifying neighbors  
-BFS vs DFS for graph? explain what you've done  
-Dijkstra's algorithm for shortest path (optional: use fibonacci heap)  
