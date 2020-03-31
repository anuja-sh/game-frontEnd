 This is the fornt-end application of the Memory game.
 It is a static project. So it can run independently for testing.
 Run following url in the browser: for eg: file://Documents/assignments/game-frontEnd/index.html 

### /{project_path}/index.html 

 The project can be deployed on Apache Tomcat server by following steps:

Download and install Apache tomcat from https://tomcat.apache.org/download-80.cgi
install jdk for Java from [ https://www.oracle.com/java/technologies/javase-downloads.html
Check if Java is installed successfully using following command
    ### java -version
    
 copy paste project folder in the {apacheTomcat}/webapps folder

go to {apacheTomcat}/bin path and enter following command.
The following commands need extra access in mac/linux (chmod +x Catalina.sh, chmod +x startup.sh)

    ### startup.bat  (for windows)
    ### startup.sh (for mac/linux)
    
Tomcat server will be started by default on 8080 

open game link in web browser as 
    http://localhost:8080/{game-frontend}/index.html

 The server url can be configured in constants.js in project root folder.


