FROM $CI_REGISTRY/image/node-build-14.19.x/master:latest as build

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG GITLAB_CI_ACCESS
ARG GITLAB_CI_TOKEN
ARG S3_BUCKET_NAME
ARG AWS_DEFAULT_REGION
ARG CI_COMMIT_BRANCH
ARG CI_REPOSITORY_URL
ARG CI_REGISTRY
ARG SONARQUBE_PROJECT_KEY
ARG SONARQUBE_URL
ARG SONARQUBE_TOKEN
ARG CI_PROJECT_NAME

RUN git config --global url."https://$GITLAB_CI_ACCESS:$GITLAB_CI_TOKEN@git.edenfarm.id/".insteadOf "https://git.edenfarm.id/"

RUN git clone --single-branch --branch $CI_COMMIT_BRANCH $CI_REPOSITORY_URL /var/www/html/dashboard

WORKDIR /var/www/html/dashboard

RUN aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
RUN aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
RUN aws configure set default.region $AWS_DEFAULT_REGION
RUN aws configure set output json

RUN aws s3 cp s3://$S3_BUCKET_NAME/base_env/dashboard/$CI_COMMIT_BRANCH/.env ./
RUN sed -i "s/<VERSION>/${CI_COMMIT_TAG}/g" .env
RUN npm cache clean --force
RUN npm install --force
RUN npm i @vue/cli@5.0.5 --force
RUN npm run test:unit

FROM $CI_REGISTRY/image/sonar-scanner-cli/master:latest

WORKDIR /var/www/html

COPY --from=build /var/www/html/dashboard /var/www/html/dashboard
RUN ls -lah /var/www/html/dashboard

RUN sonar-scanner -Dsonar.host.url=$SONARQUBE_URL -Dsonar.projectKey=$SONARQUBE_PROJECT_KEY -Dsonar.login=$SONARQUBE_TOKEN -Dsonar.projectName=Project-$CI_PROJECT_NAME -Dsonar.sources=./ -Dsonar.javascript.lcov.reportPaths=dashboard/coverage/lcov.info