import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';
import React from 'react';
import { type HieFacility } from '../types';

type FacilityProps = {
  facility: HieFacility;
};
const FacilityDetails: React.FC<FacilityProps> = ({ facility }) => {
  if (!facility) {
    return <>No Faclity Details</>;
  }
  return (
    <>
      <h4>Facility Details</h4>
      <Table aria-label="sample table" size="lg">
        <TableHead>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Name </strong>
            </TableCell>
            <TableCell>{facility.facility_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility ID </strong>
            </TableCell>
            <TableCell>{facility.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Registration Number </strong>
            </TableCell>
            <TableCell>{facility.registration_number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Regulator </strong>
            </TableCell>
            <TableCell>{facility.regulator}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility Level </strong>
            </TableCell>
            <TableCell>{facility.facility_level}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility Code </strong>
            </TableCell>
            <TableCell>{facility.facility_code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility Category </strong>
            </TableCell>
            <TableCell>{facility.facility_category}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility Owner </strong>
            </TableCell>
            <TableCell>{facility.facility_owner}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Facility Type </strong>
            </TableCell>
            <TableCell>{facility.facility_type}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> County </strong>
            </TableCell>
            <TableCell>{facility.county}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Sub County </strong>
            </TableCell>
            <TableCell>{facility.sub_county}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Ward </strong>
            </TableCell>
            <TableCell>{facility.ward}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Approved </strong>
            </TableCell>
            <TableCell>{facility.approved === 1 ? 'Yes' : 'No'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Operational Status </strong>
            </TableCell>
            <TableCell>{facility.operational_status}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong> Current License Expiry Date </strong>
            </TableCell>
            <TableCell>{facility.current_license_expiry_date}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
export default FacilityDetails;
