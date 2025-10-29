import React from 'react';
import { PersonAttributeField } from '../../person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../../config-schema';

export const NextOfKinNameField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'nextOfKinName',
    type: 'person attribute',
    uuid: config.fieldConfigurations.nextOfKin.nextOfKinName.personAttributeUuid,
    validation: config.fieldConfigurations.nextOfKin.nextOfKinName.validation,
    showHeading: false,
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
