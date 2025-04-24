'use server';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface PublisherType {
  PublisherID: number;
  Name: string;
  Address: string;
  Email: string;
  Phone: string;
}

export async function PublisherTable({data}: {data: PublisherType[]}) {
  return (
    <div className="grid gap-4">
      {data.map(publisher => (
        <Card key={publisher.PublisherID}>
          <CardHeader>
            <CardTitle>{publisher.Name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Address: {publisher.Address}</p>
            <p>Email: {publisher.Email}</p>
            <p>Phone: {publisher.Phone}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
