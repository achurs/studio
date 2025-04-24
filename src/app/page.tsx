"use client";

import { useState, useEffect } from "react";
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
import { query, execute, initializeDatabase } from "@/lib/db";

// Define data types
interface BookType {
  BookID: number;
  Title: string;
  Author: string;
  ISBN: string;
  Genre: string;
  Quantity: number;
  PublisherID: number;
}

interface PublisherType {
  PublisherID: number;
  Name: string;
  Address: string;
  Email: string;
  Phone: string;
}

interface MemberType {
  MemberID: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  MembershipTypeID: number;
}

interface StaffType {
  StaffID: number;
  Name: string;
  Email: string;
  Phone: string;
  Role: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BookType[]>([]);
  const [selectedTable, setSelectedTable] = useState<
    "books" | "publishers" | "members" | "staff" | null
  >(null);

  // State variables for data
  const [bookData, setBookData] = useState<BookType[]>([]);
  const [publisherData, setPublisherData] = useState<PublisherType[]>([]);
  const [memberData, setMemberData] = useState<MemberType[]>([]);
  const [staffData, setStaffData] = useState<StaffType[]>([]);

  // State variables for add dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newBook, setNewBook] = useState<Omit<BookType, "BookID" | "Quantity"> & { Quantity: string }>({
    Title: "",
    Author: "",
    ISBN: "",
    Genre: "",
    PublisherID: 1,
    Quantity: "1",
  });
  const [newPublisher, setNewPublisher] = useState<Omit<PublisherType, "PublisherID">>({
    Name: "",
    Address: "",
    Email: "",
    Phone: "",
  });
  const [newMember, setNewMember] = useState<Omit<MemberType, "MemberID" | "MembershipTypeID"> & { MembershipTypeID: string }>({
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
    MembershipTypeID: "1",
  });
  const [newStaff, setNewStaff] = useState<Omit<StaffType, "StaffID">>({
    Name: "",
    Email: "",
    Phone: "",
    Role: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await query("SELECT * FROM Books") as BookType[];
        const publishers = await query("SELECT * FROM Publishers") as PublisherType[];
        const members = await query("SELECT * FROM Members") as MemberType[];
        const staff = await query("SELECT * FROM Staff") as StaffType[];
  
        setBookData(books);
        setPublisherData(publishers);
        setMemberData(members);
        setStaffData(staff);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const results = bookData.filter((book) =>
      book.Title.toLowerCase().includes(term.toLowerCase()) ||
      book.Author.toLowerCase().includes(term.toLowerCase()) ||
      book.ISBN.includes(term)
    );
    setSearchResults(results);
  };

  const handleAddBook = async () => {
    try {
      await execute(
        "INSERT INTO Books (Title, Author, ISBN, Genre, PublisherID, Quantity) VALUES (?, ?, ?, ?, ?, ?)",
        [
          newBook.Title,
          newBook.Author,
          newBook.ISBN,
          newBook.Genre,
          newBook.PublisherID,
          parseInt(newBook.Quantity, 10),
        ]
      );
      setOpenAddDialog(false);
      setNewBook({ Title: "", Author: "", ISBN: "", Genre: "", PublisherID: 1, Quantity: "1" });
      const updatedBooks = await query("SELECT * FROM Books") as BookType[];
      setBookData(updatedBooks);
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleAddPublisher = async () => {
    try {
      await execute(
        "INSERT INTO Publishers (Name, Address, Email, Phone) VALUES (?, ?, ?, ?)",
        [newPublisher.Name, newPublisher.Address, newPublisher.Email, newPublisher.Phone]
      );
      setOpenAddDialog(false);
      setNewPublisher({ Name: "", Address: "", Email: "", Phone: "" });
      const updatedPublishers = await query("SELECT * FROM Publishers") as PublisherType[];
      setPublisherData(updatedPublishers);
    } catch (error) {
      console.error("Failed to add publisher:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      await execute(
        "INSERT INTO Members (Name, Email, Phone, Address, MembershipTypeID) VALUES (?, ?, ?, ?, ?)",
        [newMember.Name, newMember.Email, newMember.Phone, newMember.Address, parseInt(newMember.MembershipTypeID, 10)]
      );
      setOpenAddDialog(false);
      setNewMember({ Name: "", Email: "", Phone: "", Address: "", MembershipTypeID: "1" });
      const updatedMembers = await query("SELECT * FROM Members") as MemberType[];
      setMemberData(updatedMembers);
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleAddStaff = async () => {
    try {
      await execute(
        "INSERT INTO Staff (Name, Email, Phone, Role) VALUES (?, ?, ?, ?)",
        [newStaff.Name, newStaff.Email, newStaff.Phone, newStaff.Role]
      );
      setOpenAddDialog(false);
      setNewStaff({ Name: "", Email: "", Phone: "", Role: "" });
      const updatedStaff = await query("SELECT * FROM Staff") as StaffType[];
      setStaffData(updatedStaff);
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
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
                <Label htmlFor="Title" className="text-right">
                  Title
                </Label>
                <Input
                  id="Title"
                  value={newBook.Title}
                  onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Author" className="text-right">
                  Author
                </Label>
                <Input
                  id="Author"
                  value={newBook.Author}
                  onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ISBN" className="text-right">
                  ISBN
                </Label>
                <Input
                  id="ISBN"
                  value={newBook.ISBN}
                  onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Genre" className="text-right">
                  Genre
                </Label>
                <Input
                  id="Genre"
                  value={newBook.Genre}
                  onChange={(e) => setNewBook({ ...newBook, Genre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  type="number"
                  id="Quantity"
                  value={newBook.Quantity}
                  onChange={(e) => setNewBook({ ...newBook, Quantity: e.target.value })}
                  className="col-span-3"
                />
              </div>
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
                <Label htmlFor="Name" className="text-right">
                  Name
                </Label>
                <Input
                  id="Name"
                  value={newPublisher.Name}
                  onChange={(e) => setNewPublisher({ ...newPublisher, Name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="Address"
                  value={newPublisher.Address}
                  onChange={(e) => setNewPublisher({ ...newPublisher, Address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Email" className="text-right">
                  Email
                </Label>
                <Input
                  id="Email"
                  type="email"
                  value={newPublisher.Email}
                  onChange={(e) => setNewPublisher({ ...newPublisher, Email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="Phone"
                  value={newPublisher.Phone}
                  onChange={(e) => setNewPublisher({ ...newPublisher, Phone: e.target.value })}
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
                <Label htmlFor="Name" className="text-right">
                  Name
                </Label>
                <Input
                  id="Name"
                  value={newMember.Name}
                  onChange={(e) => setNewMember({ ...newMember, Name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Email" className="text-right">
                  Email
                </Label>
                <Input
                  id="Email"
                  type="email"
                  value={newMember.Email}
                  onChange={(e) => setNewMember({ ...newMember, Email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="Phone"
                  value={newMember.Phone}
                  onChange={(e) => setNewMember({ ...newMember, Phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Address" className="text-right">
                  Address
                </Label>
                <Textarea
                  id="Address"
                  value={newMember.Address}
                  onChange={(e) => setNewMember({ ...newMember, Address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="MembershipTypeID" className="text-right">
                  Membership Type ID
                </Label>
                <Input
                  type="number"
                  id="MembershipTypeID"
                  value={newMember.MembershipTypeID}
                  onChange={(e) => setNewMember({ ...newMember, MembershipTypeID: e.target.value })}
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
                <Label htmlFor="Name" className="text-right">
                  Name
                </Label>
                <Input
                  id="Name"
                  value={newStaff.Name}
                  onChange={(e) => setNewStaff({ ...newStaff, Name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Email" className="text-right">
                  Email
                </Label>
                <Input
                  id="Email"
                  type="email"
                  value={newStaff.Email}
                  onChange={(e) => setNewStaff({ ...newStaff, Email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="Phone"
                  value={newStaff.Phone}
                  onChange={(e) => setNewStaff({ ...newStaff, Phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Role" className="text-right">
                  Role
                </Label>
                <Input
                  id="Role"
                  value={newStaff.Role}
                  onChange={(e) => setNewStaff({ ...newStaff, Role: e.target.value })}
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

async function BookTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((book) => (
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

async function PublisherTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((publisher) => (
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

async function MemberTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((member) => (
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

async function StaffTable({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4">
      {data.map((staff) => (
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
