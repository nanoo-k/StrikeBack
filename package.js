// You can compile this using:
// $ node -e 'console.log(JSON.stringify(require("./package")));' > package.json
//   -or-
// $ npm run compile:packagejson
//
// TODO: Create a githook that compiles this
module.exports = {
  // WARNING:
  //          * Whenever you save new dependencies to package.json using the --save flag, be sure to include them in package.js
  //          * You should not modify package.json yourself, change package.js and compile it instead using the command above or $ npm run c:t
  
  "name": "Juniper",
  "version": "1.0.0",
  "description": "Juniper Motoshop Framework",
  "dependencies": {
    "bower": "1.4.0",
    "grunt": "0.4.5",
    "grunt-cli": "0.1.13",
    "jshint": "2.6.0",
    "uglify-js": "2.4.16",
    "protractor": "2.1.0"
  },
  "repository": {
    "type": "bitbucket",
    "url": "https://bitbucket.org/driverside/juniper"
  },
  /**
   *
   *  We're writing these scripts in place of using grunt, gulp or another build tool.
   *  Some tasks need to operate differently between dev and prod environments. Prefix the
   *  script with `dev` or `prod` accordingly.
   *
   *  Run scripts using $ npm run script-name
   *  $ npm run dev:build:all
   *  $ npm run prod:build:all
   */
  "scripts": {
    // Prints all npm environment variables
    "env": "env",

    /**
     *  Compile package.js to package.json. This strips comments and whitespace
     *
     *  Run this command whenever you update package.js
     * 
     */
    "compile:packagejson": "node -e 'console.log(JSON.stringify(require(\"./package\"), null, \"  \"));' > package.json",
    "c:pj": "npm run compile:packagejson",

    // Search for formatting and other errors in juniper app. Search all .js files in ../junper/js and subdirectories
    "jshint:jun": "jshint src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/dependencies/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/**/*.js",

    // Search for formatting and other errors in bcc angular and jquery app. Search all .js files in ../bcc/js and subdirectories
    "jshint:bcc": "jshint src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/jquery-app/*.js",

    // jshint all app-related javascript
    "jshint:all": "npm run jshint:jun && npm run jshint:bcc",

    // Before uglifying any app-related javascript, jshint that javasacript
    "predev:uglify:bcc": "npm run jshint:bcc",
    "predev:uglify:jun": "npm run jshint:jun",

    // Concatenate juniper app into ../juinper/app_compiled.js. Don't uglify––we want human-readable .js for debugging.
    "dev:uglify:jun": "uglifyjs src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/dependencies/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/**/*.js -o src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/app_compiled.js -beautify",

    // Concatenate bcc angular app into ../bcc/bcc_app_compiled.js. Don't uglify––we want human-readable .js for debugging.
    "dev:uglify:bcc": "uglifyjs src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/**/**/*.js -o src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/bcc_app_compiled.js -beautify",

    // Same as dev:uglify:jun except also uglify (ommitted -beautify flag)
    "prod:uglify:jun": "uglifyjs src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/dependencies/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/js/**/**/*.js -o src/DriverSide/Bundle/SiteBundle/Resources/public/juniper/app_compiled.js",

    // Same as dev:uglify:bcc except also uglify (ommitted -beautify flag)    
    "prod:uglify:bcc": "uglifyjs src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/**/*.js src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/ng-app/**/**/*.js -o src/DriverSide/Bundle/SiteBundle/Resources/public/bcc/bcc_app_compiled.js",

    // Compile the juniper templates
    "compile:templates" : "bash src/DriverSide/Bundle/SiteBundle/Resources/assets/sass/Juniper/themes/base/compile-templates.sh",

    /**
     *  npm-install
     *
     *  Some dependencies need to be built using grunt, gulp or another build tool. Create `npm-install` commands
     *  that install that dependencies dependencies. Create this command in conjunction with a command that executes
     *  the build tool
     */
    "npm-install:jquery-migrate": "cd src/DriverSide/Bundle/SiteBundle/Resources/public/vendor/jquery-migrate-official/ && npm install",

    /**
     *  grunt
     *
     *  Some dependencies need to be built using grunt. Wrap those commands in npm scripts. This lets us use only npm
     *  to build our project.
     */
    "grunt:uglify:jquery-migrate": "cd src/DriverSide/Bundle/SiteBundle/Resources/public/vendor/jquery-migrate-official/ && grunt concat && grunt --force uglify",

    // Build ALL dependencies that use grunt
    "grunt:all": "npm run npm-install:jquery-migrate && npm run grunt:uglify:jquery-migrate",

    // Uglify ALL apps
    "dev:uglify:all": "npm run dev:uglify:jun && npm run dev:uglify:bcc",
    "prod:uglify:all": "npm run prod:uglify:jun && npm run prod:uglify:bcc",

    // Run all commands needed to create a working project
    "dev:build:all": "npm run dev:uglify:all && npm run grunt:all && npm run compile:templates",
    "prod:build:all": "npm run prod:uglify:all && npm run grunt:all && npm run compile:templates",
    
    // npm script version of bower install
    "bower:install": "bower install",
    // TODO: To be used in conjunction with `init` command
    "postinstall": "bower install",

    // TODO: Initialize a project using the init command
    "dev:init": "npm install && npm run dev:build:all",
    "prod:init": "npm install && npm run prod:build:all",

    // Install Selenium WebDriver which is required to run our protractor tests
    "install:selenium": "curl -q --output protractor/selenium-server-standalone-2.46.0.jar http://selenium-release.storage.googleapis.com/2.46/selenium-server-standalone-2.46.0.jar && md5=$(md5 protractor/selenium-server-standalone-2.46.0.jar 2>/dev/null | awk '{ print $4 }'); if [ -z \"$md5\" ]; then md5=$(md5sum protractor/selenium-server-standalone-2.46.0.jar | cut -d ' ' -f1); fi && if [[ \"$md5\" != '0e9f78edf114943e4f0288bf9c2157f8' ]]; then rm -f protractor/selenium-server-standalone-2.46.0.jar; echo 'Download manually at http://selenium-release.storage.googleapis.com/index.html?path=2.46/'; echo \"$md5\"; fi",
    // Run our protractor tests
    // Start webdriver with `webdriver-manager start`
    "test:firefox": "protractor protractor/firefox.conf.js",
    "test:chrome": "protractor protractor/chrome.conf.js"
  },

  "devDependencies": {
    "grunt-html-angular-validate": "0.4.1"
  }
}