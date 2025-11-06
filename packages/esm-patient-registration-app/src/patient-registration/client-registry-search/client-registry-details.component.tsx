import React, { useEffect, useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, InlineLoading } from '@carbon/react';
import { showSnackbar, usePatient } from '@openmrs/esm-framework';
import {
  type RequestCustomOtpDto,
  type ClientRegistryBody,
  type AmrsPerson,
  type CustomRelationship,
} from './client-registry.types';
import ClientRegistryPatientDetails from './client-registry-patient-details.component';
import ClientRegistryDependantDetails from './client-registry-dependant-details.component';
import { fetchAmrsPatientData, fetchClientRegistryData, getRelationships } from './client-registry.resource';

interface ClientRegistryDetailsProps {
  payload: RequestCustomOtpDto;
}

const ClientRegistryDetails: React.FC<ClientRegistryDetailsProps> = ({ payload }) => {
  const [hieData, setHieData] = useState<ClientRegistryBody>();
  const [amrsPerson, setAmrsPerson] = useState<AmrsPerson>();
  const [loading, setLoading] = useState<boolean>(false);
  const { patientUuid } = usePatient();
  const [relationships, setRelationships] = useState<Array<CustomRelationship>>([]);

  useEffect(() => {
    handleHiePatientDetails();
    if (patientUuid) {
      handleAmrsPersonDetails();
      handleFetchPatientRelationships();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientUuid]);

  const handleFetchPatientRelationships = async () => {
    const resp = await getRelationships(patientUuid);
    if (resp) {
      setRelationships(resp);
    }
  };

  const handleAmrsPersonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchAmrsPatientData(patientUuid);
      if (response) {
        setAmrsPerson(response.data);
      }
      showSnackbar({
        kind: 'success',
        title: 'AMRS person data fetched successfully.',
      });
    } catch (er) {
      showSnackbar({
        kind: 'error',
        title: 'Error fetching AMRS person data.',
        subtitle: JSON.stringify(er),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHiePatientDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchClientRegistryData(payload);
      setHieData(response[0]);
      showSnackbar({
        kind: 'success',
        title: 'HIE person data fetched successfully.',
      });
    } catch (er) {
      showSnackbar({
        kind: 'error',
        title: 'Error fetching HIE person data.',
        subtitle: JSON.stringify(er),
      });
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <InlineLoading description="Verifying..." />
  ) : (
    <Tabs>
      <TabList contained>
        <Tab>Patient</Tab>
        <Tab>Dependants</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {hieData && <ClientRegistryPatientDetails hieData={hieData} amrsPerson={amrsPerson} fromDependant={false} />}
        </TabPanel>
        <TabPanel>
          {hieData && hieData.dependants ? (
            <ClientRegistryDependantDetails
              hieDependants={hieData.dependants}
              amrsPerson={amrsPerson}
              patientRelationships={relationships}
            />
          ) : (
            <div>Dependants not found.</div>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ClientRegistryDetails;
