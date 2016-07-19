from google.apputils import app
from ortools.constraint_solver import pywrapcp
from ortools.constraint_solver import routing_enums_pb2
import math
import sys
import json

data = sys.stdin.read()
billboards = json.loads(data)['billboards']

# Callback passed to SetArcCostEvaluatorOfAllVehicles to calculate
# distance between any two points. Just uses some basic Pythag.
def calculate_distance(from_index, to_index):
    from_coord = billboards[from_index];
    to_coord = billboards[to_index];
    x1 = from_coord[0]
    x2 = to_coord[0]
    y1 = from_coord[1]
    y2 = to_coord[1]

    dist = math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    return dist



def main(_):
    tsp_size = len(billboards)
    routing = pywrapcp.RoutingModel(tsp_size, 1)
    search_parameters = pywrapcp.RoutingModel.DefaultSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    search_parameters.time_limit_ms = 10000 # Limit search time to 10 seconds

    routing.SetArcCostEvaluatorOfAllVehicles(calculate_distance)
    assignment = routing.SolveWithParameters(search_parameters)

    if assignment:
        total_distance = assignment.ObjectiveValue()
        # Inspect solution.
        route_number = 0
        index = routing.Start(0) # Index of the variable for the starting node.
        route = []
        while not routing.IsEnd(index):
            # Convert variable indices to node indices in the displayed route.
            route.append(billboards[routing.IndexToNode(index)])
            index = assignment.Value(routing.NextVar(index))
        route.append(billboards[routing.IndexToNode(index)])

        sys.stdout.write(json.dumps(route))
    else:
        sys.stdout.write('error')

if __name__ == '__main__':
  app.run()