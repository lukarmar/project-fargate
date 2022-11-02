APP_NAME="process-data"
CLUSTER_NAME="process-data"
PROJECT_NAME="process-big-data"
REGION="us-east-1"
LOG_GROUP_NAME="/ecs/$PROJECT_NAME"
PATH_TEMPLATE="file://templates"

ECS_ROLE_NAME="ecsTaskExecutionRole"
ECS_ROLE_ARN="arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

CUSTON_POLICY_NAME="$APP_NAME"-policy
CUSTON_POLICY_ARN="arn:aws:iam::469324726124:policy/process-data-policy"

SSM_ENV_PATH="/prod/$PROJECT_NAME"

ECR_URI_DOCKER="469324726124.dkr.ecr.us-east-1.amazonaws.com/process-data"

TASK_DEFINITION_ARN="arn:aws:ecs:us-east-1:469324726124:task-definition/process-data:1"
VPC_ID="vpc-ef369395"

SECURITY_GROUP_NAME="$PROJECT_NAME"
GROUP_ID="sg-090aa3e7de031b013"



# O container tem que ter permissão para visualizar o bucket
# Para inserir um dado em outro bucket
# Fazer logs dentro do cloudwatch


#CREATE ROLE ECS
aws iam create-role \
    --region $REGION \
    --role-name $ECS_ROLE_NAME \
    --assume-role-policy-document $PATH_TEMPLATE/task-execution-assume-role.json \
    | tee logs/1.iam-create-role.txt


# Dar permissão de executar chamadas ecs na role
# Juntar uma role na outra. Atachar a role à cima com a à baixo
aws iam attach-role-policy \
    --region $REGION \
    --role-name $ECS_ROLE_NAME \
    --policy-arn $ECS_ROLE_ARN


# Permissões:
# Acessar o bucket
# Fazer download do csv
# Fazer o upload de relatório xlsx para app-data/reports
# Ler variáveis do Systems Manager Parameter Store
aws iam create-policy \
    --region $REGION \
    --policy-name $CUSTON_POLICY_NAME \
    --policy-document $PATH_TEMPLATE/custon-access-policy.json \
    | tee logs/2.iam-create-policy.txt

# Adicionar a policy à cima à role principal
aws iam attach-role-policy \
    --region $REGION \
    --role-name $ECS_ROLE_NAME \
    --policy-arn $CUSTON_POLICY_ARN

# Criar cluster do Elastic Service (ECS)
aws ecs create-cluster \
    --cluster-name $CLUSTER_NAME \
    | tee logs/3.create-cluster.txt



# Criar grupo de logs especifico para o cluster
aws logs create-log-group \
    --log-group-name $LOG_GROUP_NAME \
    | tee logs/4.logs-create-log-group.txt



# Criar container registry
aws ecr create-repository \
    --repository-name $APP_NAME \
    --image-scanning-configuration scanOnPush=true \
    --region $REGION \
    | tee logs/5.logs-create-docker-repo.txt



# Task definition. Configuração do container
aws ecs register-task-definition \
    --cli-input-json $PATH_TEMPLATE/task-definition.json \
    | tee logs/6.regieter-task.txt


# Listar todas as tasks definitions
aws ecs list-task-definitions
    

# Security:

# Listar vpcs
aws ec2 describe-vpcs 

# Pegar o grupo de acesso. Então preciso ver todos os securitis groups que tem. Pegar as subnets e filtrá-las
aws ec2 describe-subnets \
    --filters="Name=vpc-id,Values=$VPC_ID" \
    --query "Subnets[*].SubnetId" \
    | tee logs/7.describe-subnets.txt


# Criar security Group
aws ec2 create-security-group \
    --group-name $SECURITY_GROUP_NAME \
    --description "grupo de acesso em ecs tasks" \
    | tee logs/8.create-security-group.txt


# O security group é criado sem acesso a nada. Agora liberar acesso para porta 80 para baixar o que for necessário
aws ec2 authorize-security-group-ingress \
    --group-id $GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $REGION\
    | tee logs/9.authorize-sec-group.txt
