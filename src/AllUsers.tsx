import { useEffect, useState, type JSX } from "react";
import axios from "axios";
import {
  User, Mail, Phone, Hash, Laptop, Cpu,
  Eye, Edit, Trash
} from "lucide-react";
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
  "Name", "Username", "Email", "Phone", "Grade",
  "Directorate", "Deputy Ministry", "Position",
  "Device Limit", "Device Type", "MAC Address", "Actions"
];

export default function InternetUsersList(): JSX.Element {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InternetUser>>({});

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
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>

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
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white border 
          border-gray-200 max-w-full">
            <div className="grid grid-cols-[250px_250px_250px_250px_250px_250px_250px_250px_250px_250px_250px_250px] 
            bg-gradient-to-r from-indigo-700 to-blue-700 text-white font-semibold text-sm 
            select-none rounded-t-lg shadow-inner">
              {headers.map((header) => (
                <div
                  key={header}
                  className="px-3 py-2 border-r  last:border-r-0 flex items-center bg-indigo-700"
                  style={{ textShadow: "0 1px 1px rgba(0,0,0,0.15)" }}
                >
                  {header}
                </div>
              ))}
            </div>

            {users.map((user, idx) => (
              <div
                key={user.id}
                className={`grid grid-cols-[250px_250px_250px_250px_250px_250px_250px_250px_250px_250px_250px_250px] 
                  border-b border-gray-200 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-indigo-100 cursor-default`}
              >
                <div className="px-3 py-2 flex items-center gap-2 font-medium text-indigo-700 whitespace-nowrap 
                border-r border-gray-200">
                  <User className="w-4 h-4 shrink-0" />
                  <span>{user.name}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">{user.username}</div>

                <div className="px-3 py-2 flex items-center gap-1 text-green-700 max-w-xs break-words 
                border-r border-gray-200">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{user.email}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-blue-700 whitespace-nowrap 
                border-r border-gray-200">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{user.phone}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-purple-700 whitespace-nowrap 
                border-r border-gray-200">
                  <Hash className="w-4 h-4 shrink-0" />
                  <span>{user.grade}</span>
                </div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap 
                border-r border-gray-200">{user.directorate}</div>

                <div className="px-3 py-2 text-gray-700 whitespace-nowrap 
                border-r border-gray-200">{user.deputyMinistry}</div>

                <div className="px-3 py-2 text-gray-700 max-w-xs break-words border-r border-gray-200">
                  {user.position || "-"}
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-pink-700 whitespace-nowrap 
                border-r border-gray-200">
                  <Hash className="w-4 h-4 shrink-0" />
                  <span>{user.device_limit}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-purple-700 
                ">
                  <Laptop className="w-4 h-4 shrink-0" />
                  <span>{user.device_type}</span>
                </div>

                <div className="px-3 py-2 flex items-center gap-1 text-red-700 whitespace-nowrap 
                border-r border-gray-200">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>{user.mac_address}</span>
                </div>

                {/* Actions */}
                <div className="px-3 py-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleView(user)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-amber-600 hover:text-amber-800 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
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
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">View User</h2>
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
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
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
      <h2 className="text-2xl font-bold text-amber-700 mb-4">Edit User</h2>
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
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded"
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
