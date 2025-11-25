import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import { type HieClient } from '../types';
import ClientDependantList from './client-dependants/list/client-depandants.component';
import ClientDetails from './client-details/client-details';
import NewClientRegistration from './new-client-registration/new-client-registration';

interface NewClientTabProps {
  client: HieClient;
}

const NewClientTab: React.FC<NewClientTabProps> = ({ client }) => {
  return (
    <>
      <Tabs>
        <TabList contained>
          <Tab>Patient</Tab>
          <Tab>Dependants</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{client ? <ClientDetails client={client} /> : <></>}</TabPanel>
          <TabPanel>{client.dependants ? <ClientDependantList hieDependants={client.dependants} /> : <></>}</TabPanel>
        </TabPanels>
      </Tabs>
      <div>
        <NewClientRegistration client={client} />
      </div>
    </>
  );
};

export default NewClientTab;
