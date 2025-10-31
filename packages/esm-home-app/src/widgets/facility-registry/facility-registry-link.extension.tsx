import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurableLink } from '@openmrs/esm-framework';

export const spaBasePath = `${window.spaBase}/home`;

const FacilityRegistryLink = () => {
  const { t } = useTranslation();
  return <ConfigurableLink to={`${spaBasePath}/facility-registry`}>Facility Registry</ConfigurableLink>;
};

export default FacilityRegistryLink;
