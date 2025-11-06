import React from 'react';
import { PersonAttributeField } from '../field/person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../config-schema';

export const HighestLevelOfEducationField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'highestLevelEducation',
    type: 'person attribute',
    uuid: config.fieldConfigurations.academicOccupation.highestLevelEducation.personAttributeUuid,
    validation: config.fieldConfigurations.academicOccupation.highestLevelEducation.validation,
    showHeading: false,
    answerConceptSetUuid: null,
    customConceptAnswers: [
      {
        uuid: 'a899e0ac-1350-11df-a1f1-0026b9348838',
        label: 'NONE',
      },
      {
        uuid: 'a8afe910-1350-11df-a1f1-0026b9348838',
        label: 'PRIMARY SCHOOL',
      },
      {
        uuid: 'a8afe9d8-1350-11df-a1f1-0026b9348838',
        label: 'SECONDARY SCHOOL',
      },
      {
        uuid: 'a8afea96-1350-11df-a1f1-0026b9348838',
        label: 'COLLEGE',
      },
      {
        uuid: 'a89e4728-1350-11df-a1f1-0026b9348838',
        label: 'UNIVERSITY',
      },
      {
        uuid: 'a8aaf3e2-1350-11df-a1f1-0026b9348838',
        label: 'OTHER',
      },
    ],
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
