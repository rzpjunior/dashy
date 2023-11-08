###########################
## STEP 1 - Getting .env ##
###########################
FROM amazon/aws-cli AS deps

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION
ARG S3_BUCKET_NAME
ARG CI_COMMIT_BRANCH

WORKDIR /tmp

RUN aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
RUN aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
RUN aws configure set default.region $AWS_DEFAULT_REGION
RUN aws configure set output json

RUN aws s3 cp s3://$S3_BUCKET_NAME/base_env/dashboard/$CI_COMMIT_BRANCH/.env ./

######################
## STEP 2 - Builder ##
######################
FROM $CI_REGISTRY/image/node-build-14.19.x/master:latest AS builder

ARG GITLAB_CI_ACCESS
ARG GITLAB_CI_TOKEN

WORKDIR /var/www/html/dashboard
COPY . .
COPY --from=deps /tmp/.env ./

RUN sed -i "s|coreapi|clone.coreapi|g" .env
RUN sed -i "s|dashboard|clone.dashboard|g" .env

RUN git config --global url."https://$GITLAB_CI_ACCESS:$GITLAB_CI_TOKEN@git.edenfarm.id/".insteadOf "https://git.edenfarm.id/"

RUN npm cache clean --force
RUN npm install --force
RUN npm i @vue/cli@5.0.5 --force
RUN npm run build -- --mode development

###########################
## STEP 3 - Distribution ##
###########################
FROM $CI_REGISTRY/image/nginx/master:latest

RUN mkdir /var/log/nginx/logs
COPY nginx/dashboard.edenfarm.conf /etc/nginx/conf.d/dashboard.edenfarm.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /var/www/html/dashboard/dist /var/www/html/dashboard/dist

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
