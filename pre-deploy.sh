read -p "Enter the environment: "  environment
read -p "Enter the stage: "  stage

rm -rf cdk.out
npm i --force
cd dependencies/nodejs
npm i --force
cd ../../
npm run build
cdk synth --context environment=${environment} --context stage=${stage}

echo "Build complete for $environment environment & $stage stage"