read -p "Enter the environment: "  environment

rm -rf cdk.out
npm i --force
cd dependencies/nodejs
npm i --force
cd ../../
npm run build
npm run synth:${environment}

echo "Build complete for $environment"