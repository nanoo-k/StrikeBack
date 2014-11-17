# Getting started
. Install node
. Install bower `npm install -g bower`
. Run `bower install`
. Install posgreSQL

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

Then check your connect to the DB server using `psql`:

`psql -h localhost -U postgres Bears`

# Running the server
(Run all commands from a Node.js Command Prompt from the project's root directory)

. Run `node server.js`
. Navigate to the `localhost:8080`
