import React, { useMemo } from 'react';
import { type HieClient } from '../types';
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import { generateHieClientDetails } from '../hie-client-adapter';

interface ClientdetailsProps {
  client: HieClient;
}

const ClientDetails: React.FC<ClientdetailsProps> = ({ client }) => {
  const clientDetails = useMemo(() => generateHieClientDetails(client), [client]);

  if (!client || !clientDetails) {
    return (
      <>
        <h4>No patient Data to Display</h4>
      </>
    );
  }
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Field</TableHeader>
            <TableHeader>Value</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(clientDetails).map((key) => (
            <TableRow>
              <TableCell>{key}</TableCell>
              <TableCell>{clientDetails[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ClientDetails;
