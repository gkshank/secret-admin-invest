
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Clock, Search } from "lucide-react";
import Swal from "sweetalert2";

interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  lastUpdated: Date;
}

const mockTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    userId: "user-1",
    username: "John Doe",
    subject: "Investment Issue",
    message: "I'm having trouble with my investment package selection.",
    status: "open",
    priority: "high",
    createdAt: new Date(2024, 3, 24),
    lastUpdated: new Date(2024, 3, 24),
  },
  {
    id: "ticket-2",
    userId: "user-2",
    username: "Jane Smith",
    subject: "Withdrawal Delay",
    message: "My withdrawal has been pending for 2 days.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(2024, 3, 23),
    lastUpdated: new Date(2024, 3, 24),
  },
];

const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewTicket = (ticket: SupportTicket) => {
    Swal.fire({
      title: ticket.subject,
      html: `
        <div class="text-left space-y-4">
          <div>
            <p class="text-sm text-gray-500">From</p>
            <p class="font-medium">${ticket.username}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Message</p>
            <p class="whitespace-pre-wrap">${ticket.message}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="font-medium capitalize">${ticket.status}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Priority</p>
              <p class="font-medium capitalize">${ticket.priority}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p class="font-medium">${ticket.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Last Updated</p>
              <p class="font-medium">${ticket.lastUpdated.toLocaleDateString()}</p>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium mb-2">Reply to Ticket</label>
            <textarea id="reply" class="w-full p-2 border rounded" rows="4"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Send Reply",
      confirmButtonColor: "#0070f3",
      preConfirm: () => {
        const reply = (document.getElementById('reply') as HTMLTextAreaElement).value;
        if (!reply) {
          Swal.showValidationMessage('Please enter a reply');
          return false;
        }
        return reply;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Update ticket status and last updated
        setTickets(tickets.map(t => 
          t.id === ticket.id 
            ? { 
                ...t, 
                status: "in-progress" as const,
                lastUpdated: new Date()
              } 
            : t
        ));
        
        Swal.fire({
          icon: "success",
          title: "Reply Sent",
          text: "Your reply has been sent to the user.",
          confirmButtonColor: "#0070f3",
        });
      }
    });
  };

  const handleUpdateStatus = (ticketId: string, newStatus: SupportTicket["status"]) => {
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, status: newStatus, lastUpdated: new Date() } 
        : t
    ));
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
    }
  };

  const getPriorityColor = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage and respond to user support tickets
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="relative hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{ticket.username}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{ticket.subject}</h3>
                  <p className="text-muted-foreground line-clamp-2">{ticket.message}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {ticket.lastUpdated.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    {ticket.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(ticket.id, "resolved")}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No Support Tickets</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "No tickets match your search" : "There are no active support tickets"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
