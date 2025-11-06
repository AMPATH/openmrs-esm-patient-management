import React, { useEffect, useState } from 'react';
import { Button } from '@carbon/react';
import { showModal, age, usePatient } from '@openmrs/esm-framework';
import ClientRegistryLookupSection from './client-registry-search.component';
import { Formik } from 'formik';
import { type RequestCustomOtpDto } from './client-registry.types';
import ClientRegistryDetails from './client-registry-details.component';

const ClientRegistryVerificationTag = () => {
  const { patient } = usePatient();
  const [showCrBtn, setShowCrBtn] = useState(false);

  useEffect(() => {
    if (patient && patient.birthDate) {
      const ageArr = age(patient.birthDate).split(' ');
      if (ageArr.includes('yrs')) {
        const yrs = Number(ageArr[0]);
        setShowCrBtn(yrs > 17);
      }
    }
  }, [patient]);

  const handleClientRegistryVerification = () => {
    const dispose = showModal(
      'client-registry-verification-modal',
      {
        onConfirm: () => {
          dispose();
        },
        Component: CrFormikComponent,
        props: {
          forceClose: () => {
            dispose();
          },
        },
      },
      () => {},
    );
  };

  return showCrBtn ? (
    <Button kind="ghost" onClick={handleClientRegistryVerification}>
      Verify CR
    </Button>
  ) : (
    <></>
  );
};

interface CrFormicComponentProps {
  forceClose?(): void;
}
const CrFormikComponent: React.FC<CrFormicComponentProps> = ({ forceClose }) => {
  const initialFormValues = {};

  const handleOnClientVerified = (payload: RequestCustomOtpDto) => {
    forceClose?.();
    const dispose = showModal(
      'client-registry-verification-modal',
      {
        onConfirm: () => {
          dispose();
        },
        Component: ClientRegistryDetails,
        props: { payload: payload },
      },
      () => {},
    );
  };

  return (
    <Formik initialValues={initialFormValues} onSubmit={null}>
      <ClientRegistryLookupSection onClientVerified={handleOnClientVerified} />
    </Formik>
  );
};

export default ClientRegistryVerificationTag;
