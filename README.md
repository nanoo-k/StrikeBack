# Getting started
. Install node
. Install bower `npm install -g bower`
. Run `bower install`
. Install posgreSQL
. Create DB called "Bears" on port 5432 with password of your choosing
. Be sure to configure index.js with host, dialect, port, DBname, username and pass
. Install Ruby (to handle SCSS)

#Windows

# Running the debugger
(Run all commands from a Node.js Command Prompt from the project's root directory)

1. Run `node-debug server.js`
2. In a new console, run (can't find this command)
3. From Chrome, navigate to `http://localhost:8080/debug?port=5858`. You can debug from here.

# Starting the DB

I suggest using pgAdminIII as GUI interface.

According to my installation of postgreSQL, follow these commands to start the DB server:

1. `From H:\Program Files\PostgreSQL\9.3\bin`
2. `initdb.exe "H:\Program Files\PostgreSQL\9.3\data"`
3. `"pg_ctl" -D "H:\Program Files\PostgreSQL\9.3\data" -l logfile start`

Then check your connection to the DB server using `psql`:

`psql -h localhost -U postgres Bears`

# Running the server
(Run all commands from a Node.js Command Prompt from the project's root directory)

. Run `node server.js`
. Navigate to the `localhost:8080`



# Mac

. I run this app from a mac using Postgres.app: http://postgresapp.com/
. Install pgAdminIII http://www.postgresql.org/ftp/pgadmin3/release/v1.20.0/osx/


## Installing PostgresApp

help:
http://postgresapp.com/documentation/cli-tools.html
http://postgresapp.com/documentation/troubleshooting.html

Install app and make sure to include the binaries in your path by adding the following line to the end of your ~.bash_profile:

`export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/9.4/bin`

Ensure it installed by running `which psql` from the terminal. If all is well, you'll be able to create a new db user, pass, and DB from the normal command prompt. You'll be able to view the results by then entering `psql` to enter the psql prompt. From there use `\l` to list all databases and `\du` to list all users. Use this line to do it all at once.

`createuser thepeople -l -d`

`createdb -p 5432 Bears --owner thepeople`