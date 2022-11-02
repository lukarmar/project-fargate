
const ssmPrefix = "/prod/process-data"
 
const variables = {

    ECS_TASK_DEFINITION: {
        value: "process-data:1",
        type: "String"
    },
    ECS_CLUSTER_NAME: {
        value: "process-data",
        type: "String"
    },
    ECS_TASK_LAUNCH_TYPE: {
        value: "FARGATE",
        type: "String"
    },
    ECS_TASK_COUNT: {
        value: "1",
        type: "String"
    },
    ECS_TASK_PLATFORM_VERSION: {
        value: "LATEST",
        type: "String"
    },
    ECS_TASK_CONTAINER_NAME: {
        value: "process-data",
        type: "String"
    },
    ECS_TASK_CONTAINER_FILE_ENV_NAME: {
        value: "SURVEY_FILE",
        type: "String"
    },
    ECS_TASK_SUBNETS: {
        value: [
          "subnet-572bf50d",
          "subnet-d9b428bf",
          "subnet-95deb2dd"
        ].join(','),
        type: "StringList"
    },
    ECS_TASK_SECURITY_GROUPS: {
        value: [
            "sg-090aa3e7de031b013"
        ].join(','),
        type: "StringList"
    },
    ECS_TASK_ASSIGN_PUBLIC_IP: {
        value: "ENABLED",
        type: "String"
    },
    ECS_PROCESS_DATA_IMAGE_URL: {
        value: "469324726124.dkr.ecr.us-east-1.amazonaws.com/process-data",
        type: "String"
    },
    BUCKET_REPORTS: {
        value: "reports",
        type: "String"
    },
    LOG_GROUP_NAME: {
        value: "/ecs/process-data",
        type: "String"
    },
    SSM_PREFIX: {
        value: ssmPrefix,
        type: "String"
    },
    BUCKET_SURVEYS: {
        value: "app-process-data",
        type: "String"
    },
    REGION: {
        value: "us-east-1",
        type: "String"
    },


}

module.exports = {
    variables,
    ssmPrefix
}