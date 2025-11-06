import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader, Select, Form, TextInput, SelectItem } from '@carbon/react';

interface ClientRegistryVerificationPropsModal {
  close(): void;
  Component: React.FC;
  props: object;
}

const ClientRegistryVerificationModal: React.FC<ClientRegistryVerificationPropsModal> = ({
  close,
  Component,
  props,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <ModalHeader closeModal={close} title={t('hieClientVerificationTitle', 'HIE Client Verification')} />
      <ModalBody>
        <Component {...props} />
      </ModalBody>
    </>
  );
};

export default ClientRegistryVerificationModal;
