import React from 'react';
import { Input } from '../../input/basic-input/input/input.component';
import { PersonAttributeField } from '../person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../config-schema';

export const EmailField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'email',
    type: 'person attribute',
    uuid: config.fieldConfigurations.email.personAttributeUuid,
    validation: config.fieldConfigurations.email.validation,
    showHeading: false,
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
