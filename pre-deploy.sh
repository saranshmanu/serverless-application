read -p "Enter the stage: "  stage
read -p "Enter the environment: "  environment

rm -rf cdk.out
npm i --force
cd dependencies/nodejs
npm i --force
cd ../../
npm run build
cdk synth --context environment=${environment} --context stage=${stage} --quiet

echo "Build complete for $environment environment & $stage stage"