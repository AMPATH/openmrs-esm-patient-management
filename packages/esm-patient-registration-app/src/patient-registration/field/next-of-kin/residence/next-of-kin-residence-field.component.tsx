import React from 'react';
import { PersonAttributeField } from '../../person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../../config-schema';

export const NextOfKinResidenceField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'nextOfKinResidence',
    type: 'person attribute',
    uuid: config.fieldConfigurations.nextOfKin.nextOfKinResidence.personAttributeUuid,
    validation: config.fieldConfigurations.nextOfKin.nextOfKinResidence.validation,
    showHeading: false,
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
