

# from ortools.constraint_solver import pywrapcp
# from ortools.constraint_solver import routing_enums_pb2
# import math


import falcon
from falcon_cors import CORS
import json
 
class Routing:
    def on_post(self, req, resp):
        resp.body = req.body
        # """Handles GET requests"""
        # quote = {
        #     'quote': 'I\'ve always been more interested in the future than in the past.',
        #     'author': 'Grace Hopper'
        # }

        # resp.body = json.dumps(quote)

cors = CORS(allow_origins_list=['*'])
api = falcon.API()
api.add_route('/', Routing())