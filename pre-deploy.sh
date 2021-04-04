read -p "Enter the environment: "  environment

rm -rf cdk.out
npm i --force
cd dependencies/nodejs
npm i --force
cd ../../
cdk synth --quiet --context env_name=$environment

echo "Build complete for $environment"