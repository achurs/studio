
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Search, Book, Users, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bookData = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Fiction",
    availability: "Available",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: "Fiction",
    availability: "Borrowed",
  },
];

const publisherData = [
  {
    id: 1,
    name: "Penguin Books",
    address: "New York, USA",
    email: "contact@penguin.com",
    phone: "1234567890",
  },
  {
    id: 2,
    name: "HarperCollins",
    address: "London, UK",
    email: "info@harpercollins.com",
    phone: "0987654321",
  },
];

const memberData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "123 Main St",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9123456780",
    address: "456 Elm St",
  },
];

const staffData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "9012345678",
    role: "Librarian",
  },
  {
    id: 2,
    name: "Bob Williams",
    email: "bob@example.com",
    phone: "8901234567",
    role: "Assistant",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(bookData);
  const [selectedTable, setSelectedTable] = useState<
    "books" | "publishers" | "members" | "staff" | null
  >(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const results = bookData.filter((book) =>
      book.title.toLowerCase().includes(term.toLowerCase()) ||
      book.author.toLowerCase().includes(term.toLowerCase()) ||
      book.isbn.includes(term)
    );
    setSearchResults(results);
  };

  const renderTable = () => {
    switch (selectedTable) {
      case "books":
        return (
          <>
            <CardTitle>Books</CardTitle>
            <BookTable data={bookData} />
          </>
        );
      case "publishers":
        return (
          <>
            <CardTitle>Publishers</CardTitle>
            <PublisherTable data={publisherData} />
          </>
        );
      case "members":
        return (
          <>
            <CardTitle>Members</CardTitle>
            <MemberTable data={memberData} />
          </>
        );
      case "staff":
        return (
          <>
            <CardTitle>Staff</CardTitle>
            <StaffTable data={staffData} />
          </>
        );
      default:
        return <CardTitle>Select a table to browse</CardTitle>;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar
        width="16rem"
        variant="inset"
        collapsible="icon"
        style={{ height: "100vh" }}
      >
        <SidebarHeader>
          <h2 className="text-lg font-semibold">LibraryLook</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Search</SidebarGroupLabel>
            <SidebarMenuItem>
              <Input
                type="search"
                placeholder="Search books..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Browse</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSelectedTable("books")}>
                  <Book />
                  <span>Books</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSelectedTable("publishers")}>
                  <Users />
                  <span>Publishers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSelectedTable("members")}>
                  <User />
                  <span>Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setSelectedTable("staff")}>
                  <User />
                  <span>Staff</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">
          <Card>
            <CardHeader>{renderTable()}</CardHeader>
            <CardContent>
              {searchTerm && searchResults.length > 0 ? (
                <BookTable data={searchResults} />
              ) : searchTerm && searchResults.length === 0 ? (
                <p>No books found.</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function BookTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((book) => (
        <Card key={book.id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Author: {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Genre: {book.genre}</p>
            <p>Availability: {book.availability}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PublisherTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((publisher) => (
        <Card key={publisher.id}>
          <CardHeader>
            <CardTitle>{publisher.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Address: {publisher.address}</p>
            <p>Email: {publisher.email}</p>
            <p>Phone: {publisher.phone}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MemberTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((member) => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle>{member.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {member.email}</p>
            <p>Phone: {member.phone}</p>
            <p>Address: {member.address}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StaffTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((staff) => (
        <Card key={staff.id}>
          <CardHeader>
            <CardTitle>{staff.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {staff.email}</p>
            <p>Phone: {staff.phone}</p>
            <p>Role: {staff.role}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
