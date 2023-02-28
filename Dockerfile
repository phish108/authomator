# Create runtime (public) container
FROM node:19-alpine

LABEL maintainer="phish108 <cpglahn@gmail.com>"
LABEL org.opencontainers.image.source="https://github.com/phish108/authomator"

COPY package*.json /app/
COPY entrypoint.sh /app/
COPY lib /app/lib/
COPY views /app/views/
# COPY demo /app/demo

WORKDIR /app
RUN adduser -S authomator && \
    chmod 500 /app/entrypoint.sh && \
    npm ci --omit=dev && \
    chown -R authomator /app

USER authomator
ENTRYPOINT [ "/app/entrypoint.sh" ]
