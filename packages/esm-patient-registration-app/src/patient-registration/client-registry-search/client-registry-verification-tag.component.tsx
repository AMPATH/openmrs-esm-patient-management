import React from 'react';
import { Button } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';

const ClientRegistryVerificationTag = () => {
  const handleClientRegistryVerification = () => {
    const dispose = showModal(
      'client-registry-verification-modal',
      {
        onConfirm: () => {
          dispose();
        },
      },
      () => {},
    );
  };

  return (
    <>
      <span>&middot;</span>
      <Button kind="ghost" onClick={handleClientRegistryVerification}>
        Verify CR
      </Button>
    </>
  );
};

export default ClientRegistryVerificationTag;
