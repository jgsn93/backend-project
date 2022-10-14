# Josh Geeson's News API

## Background and Description

This is the first project I have completed since being at Northcoders, building an API for the purpose of accessing data programatically stored within a PSQL database. This is to mimic the building of a real world back end service which will be built upon in my next project with front end architecture.

This server can be used to obtain `articles`, `comments`, `users`, and `topics`, as well as tools for `adding`, `deleting`, and `updating` information about them in various ways.

TDD has been at the forefront of building this app. With this being the first API I have built, the biggest challenges came from planning out all of the possible and necessary error statuses for each request. I also found due to the deadline to get the project completed in time, I was submitting pull requests without full completing or implementing feedback. This was also my first experience of utilising different git branches to carry out tasks which was somewhat stressful when it came to merging and having conflicts!

If I was to start this project again, I would plan my time a bit better and also write out from the beginning each possible error that could arise upon the success, or failure, for each specific request to an end-point.

All in all, I have thoroughly enjoyed this project and am very much looking forward to building up the front end.

## Hosting

The hosted version of the app can be viewed here:

https://josh-geeson-backend-project.herokuapp.com/api/

## Cloning the repo

In order to clone the repo you will firstly need to fork it to your github. You can then copy the clone link in the forked repo, type git clone in your terminal and then paste the clone link in like this:

```
git clone <clone link from forked repo>
```

## Installing dependencies

The following dependencies have been used within this project:

- Express.js
- pg
- pg-format
- Jest
- jest-sorted
- Supertest
- dotenv

The following command will install all of the required dependancies:

```
npm i
```

## Environment variables

You will not have access to the necessary enivironment variables as per the .gitignore. To run this program, you will need to create your own .env.development and .env.test files. The following should be inputted into the respective files:

PGDATABASE=nc_news

PGDATABASE=nc_news_test
