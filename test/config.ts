import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_API_ID = 'dummy-veracode-id';
const DEFAULT_API_SECRET = 'dummy-veracode-secret';

export const integrationConfig: IntegrationConfig = {
  veracodeApiId: process.env.VERACODE_API_ID || DEFAULT_API_ID,
  veracodeApiSecret: process.env.VERACODE_API_SECRET || DEFAULT_API_SECRET,
  targetApplication: 'US1492-1',
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
