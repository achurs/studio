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
import { Search, Book, Users, User, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define data types
interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  availability: string;
}

interface PublisherType {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface MemberType {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface StaffType {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const initialBookData: BookType[] = [
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

const initialPublisherData: PublisherType[] = [
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

const initialMemberData: MemberType[] = [
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

const initialStaffData: StaffType[] = [
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
  const [searchResults, setSearchResults] = useState<BookType[]>(initialBookData);
  const [selectedTable, setSelectedTable] = useState<
    "books" | "publishers" | "members" | "staff" | null
  >(null);

  // State variables for data
  const [bookData, setBookData] = useState<BookType[]>(initialBookData);
  const [publisherData, setPublisherData] = useState<PublisherType[]>(initialPublisherData);
  const [memberData, setMemberData] = useState<MemberType[]>(initialMemberData);
  const [staffData, setStaffData] = useState<StaffType[]>(initialStaffData);

  // State variables for add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newBook, setNewBook] = useState<Omit<BookType, "id">>({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    availability: "Available",
  });
  const [newPublisher, setNewPublisher] = useState<Omit<PublisherType, "id">>({
    name: "",
    address: "",
    email: "",
    phone: "",
  });
  const [newMember, setNewMember] = useState<Omit<MemberType, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [newStaff, setNewStaff] = useState<Omit<StaffType, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

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

  const handleAddBook = () => {
    const newId = bookData.length > 0 ? bookData[bookData.length - 1].id + 1 : 1;
    setBookData([...bookData, { id: newId, ...newBook }]);
    setOpenAddDialog(false);
    setNewBook({ title: "", author: "", isbn: "", genre: "", availability: "Available" });
  };

  const handleAddPublisher = () => {
    const newId = publisherData.length > 0 ? publisherData[publisherData.length - 1].id + 1 : 1;
    setPublisherData([...publisherData, { id: newId, ...newPublisher }]);
    setOpenAddDialog(false);
    setNewPublisher({ name: "", address: "", email: "", phone: "" });
  };

  const handleAddMember = () => {
    const newId = memberData.length > 0 ? memberData[memberData.length - 1].id + 1 : 1;
    setMemberData([...memberData, { id: newId, ...newMember }]);
    setOpenAddDialog(false);
    setNewMember({ name: "", email: "", phone: "", address: "" });
  };

  const handleAddStaff = () => {
    const newId = staffData.length > 0 ? staffData[staffData.length - 1].id + 1 : 1;
    setStaffData([...staffData, { id: newId, ...newStaff }]);
    setOpenAddDialog(false);
    setNewStaff({ name: "", email: "", phone: "", role: "" });
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

  const renderAddDialogContent = () => {
    switch (selectedTable) {
      case "books":
        return (
          <>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>Enter the details for the new book.</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Author
                </Label>
                <Input
                  id="author"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isbn" className="text-right">
                  ISBN
                </Label>
                <Input
                  id="isbn"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="genre" className="text-right">
                  Genre
                </Label>
                <Input
                  id="genre"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              {/* Availability is currently hardcoded, can be changed to a select if needed */}
            </div>
            <Button type="button" onClick={handleAddBook}>
              Add Book
            </Button>
          </>
        );
      case "publishers":
        return (
          <>
            <DialogTitle>Add New Publisher</DialogTitle>
            <DialogDescription>Enter the details for the new publisher.</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPublisher.name}
                  onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={newPublisher.address}
                  onChange={(e) => setNewPublisher({ ...newPublisher, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newPublisher.email}
                  onChange={(e) => setNewPublisher({ ...newPublisher, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newPublisher.phone}
                  onChange={(e) => setNewPublisher({ ...newPublisher, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="button" onClick={handleAddPublisher}>
              Add Publisher
            </Button>
          </>
        );
      case "members":
        return (
          <>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>Enter the details for the new member.</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={newMember.address}
                  onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="button" onClick={handleAddMember}>
              Add Member
            </Button>
          </>
        );
      case "staff":
        return (
          <>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>Enter the details for the new staff.</DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="button" onClick={handleAddStaff}>
              Add Staff
            </Button>
          </>
        );
      default:
        return <DialogTitle>Select a table to add to</DialogTitle>;
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
            <CardHeader>
              <div className="flex justify-between items-center">
                {renderTable()}
                <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {renderAddDialogContent()}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
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
