import React from 'react';
import { PersonAttributeField } from '../../person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../../config-schema';

export const NextOfKinPhoneField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'nextOfKinPhoneNumber',
    type: 'person attribute',
    uuid: config.fieldConfigurations.nextOfKin.nextOfKinPhoneNumber.personAttributeUuid,
    validation: config.fieldConfigurations.nextOfKin.nextOfKinPhoneNumber.validation,
    showHeading: false,
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
