export interface Email {
  id: string;
  subject: string;
  body: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipient: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels?: string[];
  attachments?: {
    name: string;
    type: string;
    size: string;
  }[];
}

export interface Draft extends Omit<Email, "date" | "read"> {
  lastSaved: string;
}

export const emails: Email[] = [
  {
    id: "1",
    subject: "Weekly Team Update",
    body: `
Hi Team,

Here's a summary of our progress this week:

- Completed the authentication system
- Redesigned the dashboard UI
- Fixed several critical bugs in the API
- Started implementing the email component

Next week we'll focus on finalizing the email functionality and improving performance.

Let me know if you have any questions!

Best regards,
Alex
    `,
    sender: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    recipient: "team@company.com",
    date: "2024-03-04T15:30:00Z",
    read: false,
    starred: false,
  },
  {
    id: "2",
    subject: "Project Deadline Extension",
    body: `
Hello,

I'm writing to inform you that we've decided to extend the project deadline by two weeks, to March 20th. This should give everyone enough time to complete their tasks without rushing.

The updated timeline is as follows:
- March 8: Feature freeze
- March 15: QA testing completed
- March 20: Final delivery

Please update your schedules accordingly.

Regards,
Sarah
    `,
    sender: {
      name: "Sarah Miller",
      email: "sarah.m@company.com",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    recipient: "you@example.com",
    date: "2024-03-03T09:15:00Z",
    read: true,
    starred: true,
  },
  {
    id: "3",
    subject: "Invitation: Annual Company Retreat",
    body: `
You're invited to our annual company retreat!

Date: April 15-18, 2024
Location: Mountain View Resort, Colorado
RSVP by: March 25, 2024

Activities will include team building exercises, workshops, hiking, and more. All expenses will be covered by the company.

We look forward to seeing you there!

HR Department
    `,
    sender: {
      name: "HR Department",
      email: "hr@company.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    recipient: "all-staff@company.com",
    date: "2024-03-02T11:45:00Z",
    read: false,
    starred: false,
    labels: ["important"],
  },
  {
    id: "4",
    subject: "Your Amazon Order #12345",
    body: `
Thank you for your order!

Your package is on its way and should arrive by March 8th.

Order details:
- 1x Wireless Keyboard - $59.99
- 2x HDMI Cables - $15.98
- 1x Laptop Stand - $29.99

Total: $105.96

Track your order: https://amazon.com/track/12345

Amazon Customer Service
    `,
    sender: {
      name: "Amazon",
      email: "orders@amazon.com",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    recipient: "you@example.com",
    date: "2024-03-01T14:20:00Z",
    read: true,
    starred: false,
    attachments: [
      {
        name: "invoice.pdf",
        type: "application/pdf",
        size: "256 KB",
      },
    ],
  },
  {
    id: "5",
    subject: "Meeting Notes - Product Planning",
    body: `
Hello team,

Attached are the notes from our product planning meeting yesterday.

Key points:
1. New feature prioritization for Q2
2. User feedback analysis
3. Roadmap adjustments
4. Resource allocation

Please review and send any feedback by Friday.

Thanks,
Marcus
    `,
    sender: {
      name: "Marcus Chen",
      email: "marcus@company.com",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    recipient: "product-team@company.com",
    date: "2024-02-29T16:10:00Z",
    read: false,
    starred: true,
    attachments: [
      {
        name: "meeting_notes.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: "1.2 MB",
      },
      {
        name: "roadmap.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: "875 KB",
      },
    ],
  },
];

export const drafts: Draft[] = [
  {
    id: "draft-1",
    subject: "Project proposal draft",
    body: "Here are my thoughts on the project proposal...",
    sender: {
      name: "Me",
      email: "you@example.com",
    },
    recipient: "",
    lastSaved: "2024-03-03T10:15:00Z",
    starred: false,
  },
  {
    id: "draft-2",
    subject: "Follow up regarding last meeting",
    body: "I wanted to follow up about the points we discussed...",
    sender: {
      name: "Me",
      email: "you@example.com",
    },
    recipient: "manager@company.com",
    lastSaved: "2024-03-04T09:30:00Z",
    starred: false,
  },
];
