import React, { useMemo } from 'react';
import { HieClient, type HieDependant } from '../../types';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

interface ClientDependantsListProps {
  hieDependants: HieDependant[];
}

const ClientDependantList: React.FC<ClientDependantsListProps> = ({ hieDependants }) => {
  const dependants = useMemo(() => generateDependantList(hieDependants), [hieDependants]);
  if (!hieDependants) {
    return <>No dependants</>;
  }
  function generateDependantList(hieDependants: HieDependant[]) {
    const dependants = [];
    hieDependants.forEach((dep) => {
      dependants.push({
        ...dep.result[0],
        relationship: dep.relationship,
      });
    });
    return dependants;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>No</TableHeader>
            <TableHeader>CR</TableHeader>
            <TableHeader>Relationship</TableHeader>
            <TableHeader>Full Name</TableHeader>
            <TableHeader>Gender</TableHeader>
            <TableHeader>Date of Birth</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {dependants.map((dep, index) => (
            <TableRow id={dep.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{dep.id}</TableCell>
              <TableCell>{dep.relationship}</TableCell>
              <TableCell>{`${dep.first_name} ${dep.middle_name} ${dep.last_name}`}</TableCell>
              <TableCell>{dep.gender}</TableCell>
              <TableCell>{dep.date_of_birth}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ClientDependantList;
