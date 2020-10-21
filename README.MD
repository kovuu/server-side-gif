# Gif Service

Simple GIF sharing app

## Getting Started

To deploy the application on a local machine, 
enter the database data in config/config.js. Also you need to enter your AWS s3 keys and JWT_KEY by to you.

### Prerequisites

Make sure you have NodeJS and npm installed before starting the program.
Also you need to have aws api keys for S3.


### Installing

After you prepare your configs you can start installing dependencies on the server with the command below

    npm install

After installing you can start server:
    
    npm run start
    
or use a nodemon:
     
    npm run dev       
   


## Running the tests

Unit tests are run by the command below:
    
    npm run test
    
## Deployment

Deploy instruction:

1. Change your config/config.js to primary values from git repository
2. create new Heroku project
    
        heroku container:login
        heroku create 
        
   and add Heroku Postgres add-on in the resources tab

3. After that you need to go to your new database and copy the credentials to config vars of heroku project settings.
   process.env takes data from config vars, so keys should match.
   Also enter the fields from the .env project into the config vars, except for the port 
   (JWT_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)

4. Since we have configured our project, we can push our docker image to the heroku server and release it

        heroku container:push web -a <name-of-your-heroku-project>
        heroku container:release web -a <name-of-your-heroku-project>
        heroku open        

5. The final touch to enter the Heroku console and run migrations
        
        heroku run bash -a <name-of-your-heroku-project>
        npx sequelize-cli db:migrate
        
        
