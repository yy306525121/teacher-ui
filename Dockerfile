FROM nginx

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx

EXPOSE 80
