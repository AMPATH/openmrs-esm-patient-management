import React, { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, InlineLoading } from '@carbon/react';
import { type HieClient } from '../types';
import ClientDetailsComparison from './client-details-comparison/client-details-comparison.component';
import { type CustomRelationship, type AmrsClient } from './types';
import ClientDependantsComparison from './client-dependants-comparison/client-dependants-comparison.component';
import { showSnackbar, usePatient } from '@openmrs/esm-framework';
import { fetchAmrsPatientData, getRelationships } from './existing-client.resource';

interface ExistingClientTabProps {
  hieClient: HieClient;
}

const ExistingClientTab: React.FC<ExistingClientTabProps> = ({ hieClient }) => {
  const [amrsClient, setAmrsClient] = useState<AmrsClient>();
  const [loading, setLoading] = useState<boolean>(false);
  const { patientUuid } = usePatient();
  const [relationships, setRelationships] = useState<Array<CustomRelationship>>([]);

  useEffect(() => {
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
        setAmrsClient(response.data);
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

  const handleDataSync = () => {
    window.location.reload();
  };

  return loading ? (
    <InlineLoading description="Fetching existing client details..." />
  ) : (
    <Tabs>
      <TabList contained>
        <Tab>Patient</Tab>
        <Tab>Dependants</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {hieClient && (
            <ClientDetailsComparison
              hieClient={hieClient}
              amrsClient={amrsClient}
              fromDependant={false}
              onDataSync={handleDataSync}
            />
          )}
        </TabPanel>
        <TabPanel>
          {hieClient && hieClient.dependants ? (
            <ClientDependantsComparison
              hieDependants={hieClient.dependants}
              amrsClient={amrsClient}
              patientRelationships={relationships}
              onDataSync={handleDataSync}
            />
          ) : (
            <div>Dependants not found.</div>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ExistingClientTab;
