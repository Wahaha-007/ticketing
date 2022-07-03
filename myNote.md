Installed Package

1. express-async-errors
   Enable express to has no need to use next in Async function error

2022/06/16 Try to fix git submitter's name

2. prepare for TEST
   npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server

3. Delete all images start with wahaha007/
   docker rmi $(docker images wahaha007/\* -q)

4. When move auth/src/errors, auth/src/middlewares to common/src
   npm install @types/cookie-session @types/express @types/jsonwebtoken cookie-session express express-validator jsonwebtoken

5. When copy from tickets and begin orders project
   npm install

6. To use Optimistic concurrency control plugin for Mongoose v5.0 and higher.
   npm install mongoose-update-if-current

7. Sometimes there is Error about "Enum xxx not define in @mmmtickets/common" (3 July 2022)
   -> Check the code by VCS, if no error , this likely due to not update Docker image, especially after module update
   -> Stop K8s, delete all image
   -> rebuild specific image with > docker build --no-cache -t wahaha007/xxxx .
   -> Restart skaffold
