Experimental docker manager made with javascript/ES2015. Run in browser, using nginx as reverse proxy to docker sock file.


Install the required node packages, then run gulp to compile. This steps isn't needed if you just want to run this application without modifying it.

```bash
$ npm install
$ ./node_modules/gulp/bin/gulp.js
```

Build the docker image:
```bash
$ docker build -t wildtype/docker-manager .
```

Run the container, we have to mount docker sock file from host to our container:
```bash
$ docker run -v /var/run/docker.sock:/var/run/docker.sock -p 3000:80 --name Docker-Manager -t wildtype/docker-manager
```

Docker manager can be accessed from `http://localhost:3000/`

## Security Warning
This applications doesn't have authentication. Everyone who has access to that address can start and stop your containers. Don't run this app in a public facing server, do not open access to that address to external network.
