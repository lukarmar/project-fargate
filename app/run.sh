SSM_PREFIX="/prod/process-data"

IMAGE_URL=$(aws ssm get-parameter \
    --name "$SSM_PREFIX/ECS_PROCESS_DATA_IMAGE_URL" \
    --output text \
    --query "Parameter.Value")


PROJECT_NAME=$(aws ssm get-parameter \
    --name "$SSM_PREFIX/ECS_CLUSTER_NAME" \
    --output text \
    --query "Parameter.Value")


REGION=$(aws ssm get-parameter \
    --name "$SSM_PREFIX/REGION" \
    --output text \
    --query "Parameter.Value")






aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin 469324726124.dkr.ecr.us-east-1.amazonaws.com

docker build -t $PROJECT_NAME .

docker tag $PROJECT_NAME $IMAGE_URL

docker push $IMAGE_URL


docker run \
    -v ~/.aws/:/root/.aws \
    -e SURVEY_FILE='{"Bucket":"app-process-data","Key":"survey_results_public.csv"}' \
    -e AWS_ENV_PATH="$SSM_PREFIX" \
    -e AWS_REGION="$REGION" \
    -t $IMAGE_URL


