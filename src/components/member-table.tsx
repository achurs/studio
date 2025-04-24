'use server';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface MemberType {
  MemberID: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  MembershipTypeID: number;
}

export async function MemberTable({data}: {data: MemberType[]}) {
  return (
    <div className="grid gap-4">
      {data.map(member => (
        <Card key={member.MemberID}>
          <CardHeader>
            <CardTitle>{member.Name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {member.Email}</p>
            <p>Phone: {member.Phone}</p>
            <p>Address: {member.Address}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
