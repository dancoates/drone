

import falcon
from falcon_cors import CORS
import json
import subprocess

 
class RoutingRequestHandler:
    def on_post(self, req, resp):
        body = req.stream.read();

        try:
            req.context['doc'] = json.loads(body.decode('utf-8'))

        except (ValueError, UnicodeDecodeError):
            raise falcon.HTTPError(falcon.HTTP_753,
                                   'Malformed JSON',
                                   'Could not decode the request body. The '
                                   'JSON was incorrect or not encoded as '
                                   'UTF-8.')


        child = subprocess.Popen(['python', 'route.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        out, err = child.communicate(json.dumps(req.context['doc']))
        print out
        resp.body = out
        

cors = CORS(allow_all_origins=True,allow_all_headers=True,allow_all_methods=True)
api = falcon.API(middleware=[cors.middleware])
api.add_route('/', RoutingRequestHandler())