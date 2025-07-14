import { useEffect, useState, type JSX, type SetStateAction } from "react";
import axios from "axios";
import {
  User, Eye, Edit, Trash,
  Search,
  Users
} from "lucide-react";
import GradientSidebar from "./components/Sidebar";
import {motion} from "framer-motion";

type InternetUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  position?: string;
  grade: string;
  directorate: string;
  deputyMinistry: string;
  device_limit: string;
  device_type: string;
  mac_address: string;
};

const headers = [
  "Name", "Username", "Phone","Position", "Grade",
  "Directorate", "Deputy Ministry", "Actions"
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
        const [depRes, dirRes] = await Promise.all([
          axios.get("http://localhost:3000/deputy_ministries"),
          axios.get("http://localhost:3000/directorates"),
        ]);

        setDeputyMinistryOptions(depRes.data); // Already array of { id, name }
        setDirectorateOptions(dirRes.data);
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
    setEditForm(user);
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {/* Total Users Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6"
        >
          <h3 className="text-sm font-medium text-gray-600"><Users />Total Users</h3>
          <p className="text-3xl font-bold text-blue-500">{totalUsers}</p>
        </motion.div>

        {/* Users Per Deputy Ministry */}
        {Object.entries(deputyMinistryCounts).map(([depMinistry, count], index) => (
          <motion.div
            key={depMinistry}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6"
          >
            <h3 className="text-sm font-medium text-gray-600">{depMinistry}</h3>
            <p className="text-xl font-bold text-indigo-600">{count} user{count > 1 ? "s" : ""}</p>
          </motion.div>
        ))}
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
                 <div className="relative w-full sm:w-[700px] mt-5">
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
            <div className="grid grid-cols-[200px_150px_150px_150px_80px_150px_200px_200px] 
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
              ).map((user, idx) => (
              <div
                key={user.id}
                className={`grid grid-cols-[200px_150px_150px_150px_80px_150px_200px_200px] 
                  border-b border-gray-200 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-blue-100 cursor-default`}
              >
                <div className="px-3 py-2 flex items-center gap-2 font-medium 
                text-gray-700 whitespace-nowrap 
                border-r border-gray-200">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="text-[10px]">{user.name}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r 
                border-gray-200 text-[10px]">{user.username}</div>

                <div className="px-3 py-2 flex items-center gap-1 text-gray-700 whitespace-nowrap 
                border-r border-gray-200">
                  <span className="text-[10px]">{user.phone}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 max-w-xs break-words border-r border-gray-200 text-[8px]">
                  {user.position || "-"}
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-gray-700 whitespace-nowrap 
                border-r border-gray-200">
                  <span className="text-[10px]">{user.grade}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap 
                border-r border-gray-200 text-[8px]">{user.directorate}</div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap 
                border-r border-gray-200 text-[8px]">{user.deputyMinistry}</div>

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
            ))}
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit User</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(editForm).map((key) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 capitalize">{key.replace("_", " ")}</label>
                <input
                  type="text"
                  name={key}
                  value={(editForm as any)[key] || ""}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded mt-1 text-sm"
                />
              </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-400 hover:bg-blue-700 text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
