import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Application } from '../../types';
import { Entities } from '../constants';
import { createAssessmentEntity, createProjectEntity } from './converter';

describe('#createAssessmentEntity', () => {
  test('should convert to entity', () => {
    const now = new Date();
    const veracodeApplication: Application = {
      guid: 'guid',
      profile: { name: 'myApp' },
      last_completed_scan_date: now.toString(),
      created: 'yes',
      modified: 'yes',
      results_url: 'noneofyobizness.com',
      scans: [],
    };

    const entity = createAssessmentEntity(veracodeApplication);
    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'assessment_' + veracodeApplication.guid,
        _type: Entities.ASSESSMENT._type,
        _class: Entities.ASSESSMENT._class,
        name: veracodeApplication.profile.name,
        displayName: veracodeApplication.profile.name,
        lastCompletedScanDate: parseTimePropertyValue(
          veracodeApplication.last_completed_scan_date,
        ),
        category: 'Vulnerability Scan',
        summary: `Veracode Application with name ${veracodeApplication.profile.name}`,
        internal: true,
      }),
    );
  });
});

describe('#createProjectEntity', () => {
  test('should convert to entity', () => {
    const now = new Date();
    const veracodeApplication: Application = {
      guid: 'guid',
      profile: { name: 'myApp' },
      last_completed_scan_date: now.toString(),
      created: 'yes',
      modified: 'yes',
      results_url: 'noneofyobizness.com',
      scans: [],
    };

    const entity = createProjectEntity(veracodeApplication);
    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'project_' + veracodeApplication.guid,
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        name: veracodeApplication.profile.name,
        displayName: veracodeApplication.profile.name,
        lastCompletedScanDate: parseTimePropertyValue(
          veracodeApplication.last_completed_scan_date,
        ),
      }),
    );
  });
});
