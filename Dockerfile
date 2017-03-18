FROM nginx:alpine

RUN  addgroup nginx ping
COPY nginx-config/docker /etc/nginx/conf.d/default.conf
COPY public /var/www/docker-manager/public/
COPY index.html /var/www/docker-manager/index.html

COPY SpecRunner.html /var/www/docker-manager/SpecRunner.html
COPY lib /var/www/docker-manager/lib/
COPY spec /var/www/docker-manager/spec/

CMD  ["nginx", "-g", "daemon off;"]
