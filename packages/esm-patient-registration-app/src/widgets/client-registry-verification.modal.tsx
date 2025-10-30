import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader, Select, Form, TextInput, SelectItem } from '@carbon/react';

interface ClientRegistryVerificationPropsModal {
  close(): void;
  onConfirm(): void;
}

const ClientRegistryVerificationModal: React.FC<ClientRegistryVerificationPropsModal> = ({ close, onConfirm }) => {
  const { t } = useTranslation();
  const identificationTypes = [
    { text: 'National ID', value: '' },
    { text: 'Refugee ID', value: '' },
    { text: 'Alien ID', value: '' },
    { text: 'Mandate Number', value: '' },
  ];

  return (
    <>
      <ModalHeader closeModal={close} title={t('hieClientVerificationTitle', 'HIE Client Verification')} />
      <ModalBody>
        <Form>
          <Select>
            {identificationTypes.map((selectItem) => (
              <SelectItem text={selectItem.text} value={selectItem.value} />
            ))}
          </Select>
          <TextInput
            id="client-registry-id"
            labelText="National ID or Alien ID"
            placeholder="Enter identification number"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={onConfirm}>
          {t('discard', 'Discard')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default ClientRegistryVerificationModal;
