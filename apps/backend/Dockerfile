FROM golang:1.21.1-alpine AS build-backend
RUN mkdir /app
ADD . /app
WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -o dist/main.bin .

FROM alpine:latest AS production
COPY --from=build-backend /app .
EXPOSE ${PORT}
CMD ["sh", "-c", "./dist/main.bin serve --http=0.0.0.0:$PORT"]
