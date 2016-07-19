
# Drone

This repo contains a small webapp that manages optimization of drone routing instructions.

- [View the app](http://drone.dancoat.es/)
- [View documentation](http://drone.dancoat.es/docs/)



# Development setup

## Client setup

All the client code is located in `/client`

The client can be set up by just running the below.

```
npm install
```

There are also several npm scripts set up:

- `npm test` to run mocha tests
- `npm run lint` to lint js files, this is also run while building
- `npm run docs` to generate documentation
- `npm run watch` to start webpack-dev-server and watch files
- `npm run build` to create a production bundle


## Server setup

All the server code is located in `/server`

To install most of the python requirements run:

```
pip install -r requirements.txt
```

### Installing ortools

The routing service uses Google's [or-tools](https://github.com/google/or-tools) library to generate approximate answers to the [travelling salesman problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem). or-tools is only available as .egg files so is not installable through pip. It is probably easiest to just download the .egg file and extract it as a zip.

Replace the url to be curled below with the correct one for your chosen platform here:

[https://pypi.python.org/pypi/ortools](https://pypi.python.org/pypi/ortools)

```bash
cd drone/server

curl -o ortools.zip https://pypi.python.org/packages/dc/66/5c943f71e3a69bac976f0b194a87cc20f369307458bafa025b9c67f66934/ortools-3.3629-py2.7-linux-x86_64.egg#md5=5a4c7fc2f2f0c8f3f3f58611bf59a9cf

unzip -d tmp ortools.zip

mv tmp/ortools/ .

rm -r tmp

rm ortools.zip
```

### Running the server

The server is intended to use a stack of nginx > gunicorn > falcon.

To start gunicorn run:

```
gunicorn  --error-logfile - -t 300 server:api
```

gunicorn is then proxied through nginx. Below is an example nginx config:

```
server {
    listen 80;
    server_name example.com;
    access_log  /var/log/nginx/example.com.log;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_connect_timeout 75s;
        proxy_read_timeout 300s;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

``` 