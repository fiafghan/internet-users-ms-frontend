import { useEffect, useState, type JSX, type SetStateAction } from "react";
import axios from "axios";
import {
  User, Eye, Edit, Trash,
  Search,
  Users
} from "lucide-react";
import GradientSidebar from "./components/Sidebar";
import {motion} from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type InternetUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  position?: string;
  employment_type: string;
  directorate: string;
  deputyMinistry: string;
  device_limit: string;
  device_type: string;
  mac_address?: string;
  status?:"active" | "deactive";
  violations?:"0" | "1" | "2";
  comment?:string;
};

const headers = [
  "Name", "Username", "Phone","Position", "Employment Type",
  "Directorate", "Deputy Ministry","Status", "Violations", "Comment", "Actions"
];

export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});
  const [deputyMinistryOptions, setDeputyMinistryOptions] = useState<{ id: number; name: string }[]>([]);
  const [directorateOptions, setDirectorateOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedDeputyMinistry, setSelectedDeputyMinistry] = useState<string>("");
  const [selectedDirectorate, setSelectedDirectorate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employmentTypes, setEmploymentTypes] = useState<{ id: number; type: string }[]>([]);

  const totalUsers = users.length;

  const deputyMinistryCounts: Record<string, number> = users.reduce((acc, user) => {
    const deputy = user.deputyMinistry || "Unknown";
    acc[deputy] = (acc[deputy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<InternetUser[]>("http://localhost:3000/internet_users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();

    async function fetchFilters() {
      try {
        const [depRes, dirRes, empTypeRes] = await Promise.all([
          axios.get("http://localhost:3000/deputy_ministries"),
          axios.get("http://localhost:3000/directorates"),
          axios.get("http://localhost:3000/employment_type"),
        ]);

        setDeputyMinistryOptions(depRes.data); // Already array of { id, name }
        setDirectorateOptions(dirRes.data);
        setEmploymentTypes(empTypeRes.data);
      } catch (err) {
        console.log("error fetching data!", err);
      }
    }
    fetchFilters();
  }, []);

  const handleView = (user: InternetUser) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleEdit = (user: InternetUser) => {
    setSelectedUser(user);
    setEditForm({
          ...user,
          status: user.status || "active",
          violations: user.violations || "0",
          comment: user.comment || "No comment"
        });
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/internet_users/${selectedUser.id}`,
        editForm
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? response.data : u))
      );
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3000/internet_users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-white 
    shadow-md shadow-indigo-700">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r 
      border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
        
      <main className="flex-1 ml-64 p-8 overflow-auto">
       {/* 🧊 Summary Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 
       md:grid-cols-3 gap-6 mb-10">
        {/* Total Users Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6"
        >
  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
    <Users className="w-5 h-5 text-blue-400" />
    Total Users
  </h3>

  <div className="w-48 mx-auto">
    <Doughnut
      data={{
        labels: ["Users"],
        datasets: [
          {
            data: [totalUsers, Math.max(100 - totalUsers, 0)], // fills rest as empty
            backgroundColor: ["#60A5FA", "#E5E7EB"], // blue-400 and gray-200
            borderWidth: 0,
          },
        ],
      }}
      options={{
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      }}
    />
    <div className="absolute top-[50%] transform -translate-x-1/2 -translate-y-[50%] text-center">
      <p className="text-3xl font-bold text-blue-500 ml-50">{totalUsers}</p>
      <p className="text-xs text-gray-500 ml-50">Users</p>
    </div>
  </div>
</motion.div>

          
        {/* Users Per Deputy Ministry */}
        <div className="bg-white rounded-md shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Users Per Deputy Ministry</h2>
      <div className="space-y-4">
        {Object.entries(deputyMinistryCounts).map(([depMinistry, count], index) => {
      const max = Math.max(...Object.values(deputyMinistryCounts)); // for proportional width
      const widthPercent = (count / max) * 100;

      return (
        <motion.div
          key={depMinistry}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
        >
          <div className="text-sm text-gray-700 mb-1 font-medium">
            {depMinistry} ({count} user{count > 1 ? "s" : ""})
          </div>
          <div className="bg-blue-100 rounded-lg h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${widthPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + index * 0.1 }}
              className="h-full bg-blue-300 text-white text-xs flex items-center px-3 font-semibold"
            >
              {count}
            </motion.div>
          </div>
          
        </motion.div>
        
      );
    })}
    
  </div>
  
</div>

            {/* Users Per Deputy Ministry - Pie Chart */}
<div className="bg-white rounded-md shadow-md border border-gray-200 p-6">
  <h2 className="text-lg font-bold text-gray-700 mb-4">Users Distribution</h2>
  <div className="w-full max-w-md mx-auto">
    <Pie
      data={{
        labels: Object.keys(deputyMinistryCounts),
        datasets: [
          {
            label: "Users",
            data: Object.values(deputyMinistryCounts),
            backgroundColor: [
              "#60A5FA", // blue-400
              "#3B82F6", // blue-500
              "#1D4ED8", // blue-700
              "#DBEAFE", // blue-100
              "#BFDBFE", // blue-200
              "#93C5FD"  // blue-300
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
          }
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: {
              color: "#1F2937", // gray-800
              font: { size: 12 },
            },
          },
        },
      }}
    />
  </div>
</div>

      </div>

        <div className="flex gap-4 mb-4">
          
          <div>
             <label htmlFor="deputyMinistryFilter" className="block text-sm font-medium 
            text-gray-700">
              Deputy Ministry
            </label>
            <select
              id="deputyMinistryFilter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm f
              ocus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-7 
              shadow-md shadow-gray-400 p-2 text-gray-700"
              value={selectedDeputyMinistry}
              onChange={(e) => setSelectedDeputyMinistry(e.target.value)}
            >
              <option value="">All</option>
              {deputyMinistryOptions.map((dep) => (
                <option key={dep.id} value={dep.name}>{dep.name}</option>
              ))}
            </select>
          </div>

          {/* Directorate Filter */}
          <div>
            <label htmlFor="directorateFilter" className="block text-sm font-medium 
            text-gray-700 text-gray-700">
              Directorate
            </label>
            <select
              id="directorateFilter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
              h-7 shadow-md shadow-gray-400 p-2 text-gray-700"
              value={selectedDirectorate}
              onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSelectedDirectorate(e.target.value)}
            >
              <option value="">All</option>
              {directorateOptions.map((dir) => {
                return (
                  <option key={dir.id} value={dir.name}>
                    {dir.name}
                  </option>
                );
              })}
            </select>
          </div>
                 <div className="relative w-full sm:w-[900px] mt-5">
                  <input
                    id="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-4 py-2 pl-10 rounded-lg shadow-md border border-blue-400 
                    focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm 
                    placeholder:text-blue-300 text-gray-700 
                    bg-white shadow-md shadow-blue-400"
                    autoComplete="on"
                    autoCorrect="on"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center py-6 text-gray-500 font-medium">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-sm 
          shadow-lg bg-white border 
          border-gray-200 max-w-full">
            <div className="grid grid-cols-[200px_150px_150px_150px_150px_150px_200px_200px_200px_200px_200px] 
            bg-blue-400 text-white font-semibold text-sm 
            select-none rounded-t-lg shadow-inner">
              {headers.map((header) => (
                <div
                  key={header}
                  className="px-3 py-2 border-r  last:border-r-0 flex items-center 
                  bg-blue-300 text-[10px]"
                  style={{ textShadow: "0 1px 1px rgba(0,0,0,0.15)" }}
                >
                  {header}
                </div>
              ))}
            </div>

            {users
              .filter((user) => 
                (selectedDeputyMinistry === "" || user.deputyMinistry === selectedDeputyMinistry) &&
                (selectedDirectorate === "" || user.directorate === selectedDirectorate) &&
                (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
              )
              ).map((user, idx) => {
    const isRedCard = user.violations === "2";
    const isYellowCard = user.violations === "1";

    return (
      <div
        key={user.id}
        className={`grid grid-cols-[200px_150px_150px_150px_150px_150px_200px_200px_200px_200px_200px] 
          border-b border-gray-200 transition-colors duration-200 ${
          isRedCard
            ? "bg-red-100"
            : idx % 2 === 0
            ? "bg-gray-100"
            : "bg-white"
        } hover:bg-blue-100 cursor-default`}
      >
        <div className="px-3 py-2 flex items-center gap-2 font-medium 
          text-gray-700 whitespace-nowrap border-r border-gray-200">
          <User className="w-4 h-4 shrink-0" />
          <span className="text-[10px]">
            {user.name}
            {isYellowCard && <span className="ml-1">🟨</span>}
            {isRedCard && <span className="ml-1">🟥</span>}
          </span>
        </div>

        <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200 text-[10px]">
          {user.username}
        </div>

        <div className="px-3 py-2 flex items-center gap-1 text-gray-700 whitespace-nowrap border-r border-gray-200">
          <span className="text-[10px]">{user.phone}</span>
        </div>

        <div className="px-3 py-2 text-gray-700 max-w-xs break-words border-r border-gray-200 text-[8px]">
          {user.position || "-"}
        </div>

        <div className="px-3 py-2 flex items-center gap-1 text-gray-700 whitespace-nowrap border-r border-gray-200">
          <span className="text-[10px]">{user.employment_type}</span>
        </div>

        <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200 text-[8px]">
          {user.directorate}
        </div>

        <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200 text-[8px]">
          {user.deputyMinistry}
        </div>

        <div className="px-3 py-2 text-gray-700 border-r border-gray-200 text-[10px]">
          {user.status || "-"}
        </div>

        <div className="px-3 py-2 text-gray-700 border-r border-gray-200 text-[10px]">
          {user.violations || "0"}
        </div>

        <div className="px-3 py-2 text-gray-700 border-r border-gray-200 text-[10px] truncate max-w-[120px]">
          {user.comment || "-"}
        </div>

        {/* Actions */}
        <div className="px-3 py-2 flex items-center justify-center gap-2 bg-blue-300">
          <button
            onClick={() => handleView(user)}
            className="text-white hover:text-blue-100 transition-colors"
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleEdit(user)}
            className="text-white hover:text-blue-100 transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="text-white hover:text-blue-100 transition-colors"
            title="Delete"
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  })}
          </div>
        )}
      </main>
      {/* View Modal */}
        {isViewOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">View User</h2>
              <ul className="space-y-1 text-gray-800">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <li key={key}>
                    <strong className="capitalize">{key.replace("_", " ")}:</strong>{" "}
                    {value || "-"}
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-blue-400 hover:bg-blue-700 text-white rounded"
                >
          Close
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Edit Modal */}
{isEditOpen && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl border border-gray-200 flex flex-col lg:flex-row">
      
      {/* Left - Preview */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-100 to-blue-200 p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">Edit User</h2>
        <p className="text-sm text-blue-700 mb-4">Make changes to this user's profile.</p>
        <ul className="space-y-2 text-sm text-blue-900 overflow-auto max-h-[80vh] pr-2">
          {Object.entries(selectedUser).map(([key, value]) => (
            <li key={key}>
              <strong className="capitalize">{key.replace("_", " ")}:</strong> {value || "-"}
            </li>
          ))}
        </ul>
      </div>

      {/* Right - Form */}
      <div className="lg:w-1/2 w-full p-8 bg-white overflow-y-auto max-h-[90vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(editForm).map((key) =>
            key !== "status" && key !== "violations" && key !== "comment" && key !== "employment_type" ? (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace("_", " ")}</label>
                <input
                  type="text"
                  name={key}
                  value={(editForm as any)[key] || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ) : null
          )}

          {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select
                  name="employment_type"
                  value={editForm.employment_type || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Employment Type</option>
                  {employmentTypes.map((type) => (
                    <option key={type.id} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={editForm.status || "active"}
              onChange={handleEditChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>

          {/* Violations */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Violations</label>
            <select
              name="violations"
              value={editForm.violations || "0"}
              onChange={handleEditChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
              focus:ring-2 focus:ring-blue-400"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          {/* Comment */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              name="comment"
              value={editForm.comment || ""}
              onChange={handleEditChange}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              placeholder="Write a comment..."
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4 border-t pt-4 border-gray-200">
          <button
            onClick={() => setIsEditOpen(false)}
            className="px-5 py-2 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-5 py-2 rounded-md text-sm text-white bg-blue-500 hover:bg-blue-600 transition shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
