import {
  createIntegrationEntity,
  MappedRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { Entities, Relationships, Steps } from '../constants';

describe('findingSteps', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });
  describe('#fetchFindings', () => {
    test('creates Finding step entities', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'fetchFindingsShouldCreateEntities',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.FINDINGS);
      const result = await executeStepWithDependencies(stepConfig);
      expect(result.collectedEntities.length).toBe(12),
        expect(result.collectedEntities).toMatchGraphObjectSchema(
          Entities.FINDING,
        );
    });

    test('creates Finding step relationships', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'fetchFindingsShouldCreateRelationships',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.FINDINGS);
      const result = await executeStepWithDependencies(stepConfig);
      expect(result.collectedRelationships.length).toBe(36);

      const assessmentFindingRelationships =
        result.collectedRelationships.filter(
          (r) => r._type === Relationships.ASSESSMENT_IDENTIFIED_FINDING._type,
        );
      expect(assessmentFindingRelationships).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.IDENTIFIED },
            _type: {
              const: Relationships.ASSESSMENT_IDENTIFIED_FINDING._type,
            },
          },
        },
      });
      expect(assessmentFindingRelationships.length).toBe(12);

      const projectFindingRelationships = result.collectedRelationships.filter(
        (r) => r._type === Relationships.PROJECT_HAS_FINDING._type,
      );
      expect(projectFindingRelationships).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.HAS },
            _type: {
              const: Relationships.PROJECT_HAS_FINDING._type,
            },
          },
        },
      });
      expect(projectFindingRelationships.length).toBe(12);

      const findingCWERelationships = (
        result.collectedRelationships as MappedRelationship[]
      ).filter((r) => r._mapping?.targetEntity?._type === 'cwe');
      const cweIds = [113, 80, 601]; // cwe ids found in recording
      expect(findingCWERelationships.length).toBe(12);
      expect(findingCWERelationships).toTargetEntities(
        cweIds.map((id) =>
          createIntegrationEntity({
            entityData: {
              source: {},
              assign: {
                _class: ['Weakness'],
                _type: 'cwe',
                _key: `cwe-${id}`,
                displayName: `CWE-${id}`,
                references: [
                  `https://cwe.mitre.org/data/definitions/${id}.html`,
                ],
              },
            },
          }),
        ),
      );
    });
  });
});
