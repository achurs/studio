// src/components/book-table.tsx
'use server';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface BookType {
  BookID: number;
  Title: string;
  Author: string;
  ISBN: string;
  Genre: string;
  Quantity: number;
  PublisherID: number;
}

export async function BookTable({data}: {data: BookType[]}) {
  return (
    <div className="grid gap-4">
      {data.map(book => (
        <Card key={book.BookID}>
          <CardHeader>
            <CardTitle>{book.Title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Author: {book.Author}</p>
            <p>ISBN: {book.ISBN}</p>
            <p>Genre: {book.Genre}</p>
            <p>Quantity: {book.Quantity}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
