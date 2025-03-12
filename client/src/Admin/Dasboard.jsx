import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom"; // Import useLocation to get state
import { FaFileAlt, FaClipboardList } from "react-icons/fa"; // Import Icons

function Dasboard() {
  const location = useLocation();
  const [userName, setUserName] = useState(location.state?.userName || ""); // Get userName from location state

  return (
    <div className="flex">
      <Sidebar userName={userName} />
      <div className="flex-1 ml-64">
        <Navbar className="ml-4"/>
        <main className="p-6">
          <h2 className="text-3xl font-semibold mb-6">Welcome Admin !!</h2>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Questions"
              count="10"
              icon={<FaFileAlt className="text-blue-500 text-3xl" />}
            />
            <DashboardCard
              title="Generated Papers"
              count="2"
              icon={<FaClipboardList className="text-orange-500 text-3xl" />}
            />
           <DashboardCard
              title="Total Users"
              count="4"
              icon={<FaClipboardList className="text-indigo-500 text-3xl" />}
            />
          </div>

          {/* Quick Actions */}
          {/* <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard title="Manage Questions" link="/questions" ><Link to=""/></ActionCard>
              <ActionCard title="Create Question Paper" link="/generate-paper" />
              <ActionCard title="View Reports" link="/reports" />
            </div>
          </div> */}
        </main>
      </div>
    </div>
  );
}
const DashboardCard = ({ title, count, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  );
  
  // Quick Action Card
  // const ActionCard = ({ title, link }) => (
  //   <a
  //     href={link}
  //     className="bg-white p-6 rounded-xl shadow-md text-center hover:bg-gray-200 transition"
  //   >
  //     <h4 className="text-lg font-semibold">{title}</h4>
  //   </a>
  // );
export default Dasboard;