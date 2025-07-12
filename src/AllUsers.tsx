import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import { User, Mail, Phone, Hash, Laptop, Cpu } from "lucide-react";
import GradientSidebar from "./components/Sidebar";

type InternetUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  grade: string;
  directorate: string;
  deputyMinistry: string;
  position?: string;
  device_limit: string;
  device_type: string;
  mac_address: string;
};

const headers = [
  "Name",
  "Username",
  "Email",
  "Phone",
  "Grade",
  "Directorate",
  "Deputy Ministry",
  "Position",
  "Device Limit",
  "Device Type",
  "MAC Address",
];

export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<InternetUser[]>(
          "http://localhost:3000/internet_users"
        );
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>

      {/* Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Internet Users List
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center py-6 text-gray-500 font-medium">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200 max-w-full">
            {/* Header row */}
            <div className="grid grid-cols-[180px_140px_200px_120px_80px_140px_140px_180px_100px_100px_140px] bg-gradient-to-r from-indigo-700 to-blue-700 text-white font-semibold text-sm select-none rounded-t-lg shadow-inner">
              {headers.map((header) => (
                <div
                  key={header}
                  className="px-3 py-2 border-r border-indigo-600 last:border-r-0 flex items-center"
                  style={{ textShadow: "0 1px 1px rgba(0,0,0,0.15)" }}
                >
                  {header}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {users.map((user, idx) => (
              <div
                key={user.id}
                className={`grid grid-cols-[180px_140px_200px_120px_80px_140px_140px_180px_100px_100px_140px] border-b border-gray-200 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-100 cursor-default`}
                style={{ userSelect: "none" }}
              >
                <div className="px-3 py-2 flex items-center gap-2 font-medium text-indigo-700 whitespace-nowrap border-r border-gray-200">
                  <User className="w-4 h-4 shrink-0" />
                  <span>{user.name}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">{user.username}</div>

                <div className="px-3 py-2 flex items-center gap-1 text-green-700 max-w-xs break-words border-r border-gray-200">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{user.email}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-blue-700 whitespace-nowrap border-r border-gray-200">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{user.phone}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-purple-700 whitespace-nowrap border-r border-gray-200">
                  <Hash className="w-4 h-4 shrink-0" />
                  <span>{user.grade}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">{user.directorate}</div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">{user.deputyMinistry}</div>

                <div className="px-3 py-2 text-gray-700 max-w-xs break-words border-r border-gray-200">{user.position || "-"}</div>

                <div className="px-3 py-2 flex items-center gap-1 text-pink-700 whitespace-nowrap border-r border-gray-200">
                  <Hash className="w-4 h-4 shrink-0" />
                  <span>{user.device_limit}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-purple-700 whitespace-nowrap border-r border-gray-200">
                  <Laptop className="w-4 h-4 shrink-0" />
                  <span>{user.device_type}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-red-700 whitespace-nowrap">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>{user.mac_address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
