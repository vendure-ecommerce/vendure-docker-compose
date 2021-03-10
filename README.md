# Vendure Docker Compose

This is a [Docker Compose](https://docs.docker.com/compose/) project for [Vendure](https://www.vendure.io/) which defines and runs 4 containers:

1. Postgres for data persistence
2. Vendure server
3. Vendure worker
4. Example storefront

This project can be used to explore Vendure, to perform performance or security testing, or as an example of how to containerize the various parts of a Vendure application.

## Usage

1. Make sure you have [Docker installed](https://docs.docker.com/get-docker/)
2. Clone this repo `git clone git@github.com:vendure-ecommerce/vendure-docker-compose.git --depth 1`
3. From the project root run `docker-compose up`

The initial run will take some minutes to build all the containers and populate some test data.

* Admin UI: http://localhost:3000/admin/
* Storefront: http://localhost:4000
