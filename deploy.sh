read -p "Enter the stage: "  stage
read -p "Enter the environment: "  environment

cdk deploy --context environment=${environment} --context stage=${stage} --all --require-approval never

echo "Deployment complete for $environment environment & $stage stage"