import React from "react";
import { useNavigate } from "react-router-dom"; // react-router v6
import {
  MdPersonAdd,
  MdInbox,
  MdListAlt,
  MdAssignmentTurnedIn,
  MdMailOutline,
  MdCheckCircleOutline,
  MdDescription,
  MdSend,
} from "react-icons/md";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailCampaignDashboard() {
  const navigate = useNavigate();

  // Dummy stats
  const stats = {
    contacts: 512,
    activeContacts: 420,
    inactiveContacts: 92,
    categories: 8,
    campaigns: 25,
    sentEmails: 1500,
    failedEmails: 45,
  };

  // Card component
  const Card = ({ icon: Icon, title, description, value, color, link }) => {
    return (
      <div
        onClick={() => link && navigate(link)}
        className={`relative bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer flex items-center space-x-4`}
      >
        {/* Number badge in top-left corner */}
        {value !== undefined && (
          <div
            className={`absolute top-3 left-3 bg-${color}-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10`}
            title={`${title} Count`}
          >
            {value}
          </div>
        )}

        {/* Icon */}
        <div
          className={`p-3 rounded-full bg-${color}-100 text-${color}-600 flex items-center justify-center flex-shrink-0`}
          style={{ minWidth: 50, minHeight: 50 }}
        >
          <Icon size={28} />
        </div>

        {/* Text content */}
        <div>
          <h3 className="text-md font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            Email Campaign Manager
          </h1>
          <p className="text-indigo-600 font-medium">
            Manage your contacts, campaigns, and delivery reports effortlessly.
          </p>
        </header>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* <Card
            icon={MdPersonAdd}
            title="Contacts List"
            description="Store and manage recipient emails."
            value={stats.contacts}
            color="indigo"
            link="/add/email/contacts"
          /> */}
          <Card
            icon={MdInbox}
            title="Contacts List"
            description={`Active: ${stats.activeContacts} | Inactive: ${stats.inactiveContacts}`}
            value={stats.contacts}
            color="green"
            link="/email/contacts/list"
          />
          <Card
            icon={MdListAlt}
            title="Email Categories"
            description="Organize campaigns with category manager."
            value={stats.categories}
            color="purple"
            link="/email/categories"
          />
          {/* <Card
            icon={MdDescription}
            title="Create Campaign"
            description="Design email content & upload files."
            color="yellow"
            link="/campaigns/create"
          /> */}
          <Card
            icon={MdMailOutline}
            title="Campaigns"
            description="View all email campaigns."
            value={stats.campaigns}
            color="orange"
            link="/campaigns"
          />
          <Card
            icon={MdAssignmentTurnedIn}
            title="Assign Campaign"
            description="Assign campaigns to selected categories."
            color="pink"
            link="/campaigns/assign"
          />

          <Card
            icon={MdSend}
            title="Send Emails"
            description="Send emails to active contacts."
            value={stats.sentEmails}
            color="blue"
            link="/emails/send"
          />
          <Card
            icon={MdCheckCircleOutline}
            title="Delivery Report"
            description={`Sent: ${stats.sentEmails} | Failed: ${stats.failedEmails}`}
            color="teal"
            link="/reports/delivery"
          />
        </main>
      </div>
    </DashboardLayout>
  );
}
