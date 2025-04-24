'use server';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface StaffType {
  StaffID: number;
  Name: string;
  Email: string;
  Phone: string;
  Role: string;
}

export async function StaffTable({data}: {data: StaffType[]}) {
  return (
    <div className="grid gap-4">
      {data.map(staff => (
        <Card key={staff.StaffID}>
          <CardHeader>
            <CardTitle>{staff.Name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {staff.Email}</p>
            <p>Phone: {staff.Phone}</p>
            <p>Role: {staff.Role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
