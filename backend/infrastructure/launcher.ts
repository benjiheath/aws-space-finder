import { SpaceStack } from './spaceStack';
import { App } from 'aws-cdk-lib';

const app = new App();
new SpaceStack(app, 'Space-Finder', {
  stackName: 'SpaceFinder',
  env: { region: 'ap-southeast-2' },
});
