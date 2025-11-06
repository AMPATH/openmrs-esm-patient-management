import React from 'react';
import { PersonAttributeField } from '../../person-attributes/person-attribute-field.component';
import { useConfig } from '@openmrs/esm-framework';
import { type RegistrationConfig } from '../../../../config-schema';

export const NextOfKinRelationshipField = () => {
  const config = useConfig<RegistrationConfig>();

  const fieldDefinition = {
    id: 'nextOfKinRelationship',
    type: 'person attribute',
    uuid: config.fieldConfigurations.nextOfKin.nextOfKinRelationship.personAttributeUuid,
    validation: config.fieldConfigurations.nextOfKin.nextOfKinRelationship.validation,
    answerConceptSetUuid: null,
    customConceptAnswers: [
      { label: 'Parent/Child', uuid: '7878d348-1359-11df-a1f1-0026b9348838' },
      { label: 'Doctor/Patient', uuid: '7878d898-1359-11df-a1f1-0026b9348838' },
      { label: 'Sibling/Sibling', uuid: '7878dc30-1359-11df-a1f1-0026b9348838' },
      { label: 'Aunt/Uncle/Niece/Nephew', uuid: '7878dd3e-1359-11df-a1f1-0026b9348838' },
      { label: 'Caretaker/Patient', uuid: '7878de42-1359-11df-a1f1-0026b9348838' },
      { label: 'Spouse/Spouse', uuid: '7878df3c-1359-11df-a1f1-0026b9348838' },
      { label: 'Child-in-law/Parent-in-law', uuid: '7878e040-1359-11df-a1f1-0026b9348838' },
      { label: 'Grandchild/Grandparent', uuid: '7878e144-1359-11df-a1f1-0026b9348838' },
      { label: 'Co-wife/Co-wife', uuid: '7878e23e-1359-11df-a1f1-0026b9348838' },
      { label: 'Cousin/Cousin', uuid: '7878e338-1359-11df-a1f1-0026b9348838' },
      { label: 'Stepchild/Stepparent', uuid: '7878e432-1359-11df-a1f1-0026b9348838' },
      { label: 'Foster Child/Foster Parent', uuid: '7878e52c-1359-11df-a1f1-0026b9348838' },
      { label: 'Friend/Friend', uuid: '7878e626-1359-11df-a1f1-0026b9348838' },
      { label: 'Employee/Employer', uuid: '7878e720-1359-11df-a1f1-0026b9348838' },
      { label: 'Tenant/Renter/Landlord', uuid: '7878e81a-1359-11df-a1f1-0026b9348838' },
      { label: 'Household Member/Head of Household', uuid: '7878e914-1359-11df-a1f1-0026b9348838' },
      { label: 'Sexual Partner/Sexual Partner', uuid: '7878ea18-1359-11df-a1f1-0026b9348838' },
      { label: 'Guardian/Child', uuid: '01bc0cf5-d428-427f-be13-305eb9cad7ba' },
      { label: 'Nurse/Patient', uuid: '7a755398-daed-4e64-8efd-b187c661caab' },
      { label: 'Other non-coded/Other non-coded', uuid: 'af78531e-98ab-41da-be3a-6a871ecbf8c0' },
      { label: 'Peer/Patient', uuid: 'b31657ef-4784-4e22-96df-d864651aa715' },
    ],
    showHeading: false,
  };
  return <PersonAttributeField fieldDefinition={fieldDefinition} />;
};
