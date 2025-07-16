import { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertTriangle } from "lucide-react";
import GradientSidebar from "./components/Sidebar";

interface InternetUser {
  id: string;
  username: string;
  name: string;
  position: string;
  deputyMinistry: string;
  directorate: string;
  user_signature: string;
  directorate_signature: string;  
  violations: string;
  comment: string;
}

export default function AddViolation() {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<InternetUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get<InternetUser[]>("http://localhost:3000/internet_users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedUser) return alert("Please select a user");

    const violationData = {
        username: selectedUser.username,
        name: selectedUser.name,
        position: selectedUser.position,
        deputy_ministry: selectedUser.deputyMinistry,
        directorate: selectedUser.directorate,
        user_signature: selectedUser.user_signature,
        directorate_signature: selectedUser.directorate_signature,
        comment: selectedUser.comment,
        violation_count: parseInt(selectedUser.violations)
      };

    try {
          await axios.post("http://localhost:3000/violations", violationData);
          alert("Violation submitted successfully!");

          // Clear form
          setSearchTerm("");
          setSelectedUser(null);
        } catch (error) {
          console.error("Failed to submit violation", error);
          alert("Failed to submit violation. Please try again.");
        }
      };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="fixed top-0 left-0 bottom-0 w-64 border-r border-gray-200 \
      bg-white shadow-sm z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1">
        <div className="max-w-xl mx-auto bg-white rounded-md shadow-md p-6">
          <h1 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Add Violation
          </h1>
<form
  onSubmit={handleSubmit}
  dir="rtl"
  className="flex flex-1 gap-4 bg-white p-6 border rounded-none shadow-md w-300"
>
  {/* Username Combo Box */}
  <div className="col-span-2 relative">
    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
      نام کاربری
    </label>
    <input
      id="username"
      type="text"
      placeholder="جستجو بر اساس نام کاربری..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-3 py-2 pl-10 border border-blue-300 rounded shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 w-50"
    />
    <Search className="absolute left-3 top-[3.3rem] transform -translate-y-1/2 text-blue-400 w-4 h-4" />
    {searchTerm && (
      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-40 overflow-y-auto">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              setSearchTerm(user.username);
              setFilteredUsers([]);
            }}
            className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
          >
            {user.id} / {user.username}
          </li>
        ))}
      </ul>
    )}
  </div>

  {selectedUser && (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 w-50">نام</label>
        <input
          type="text"
          value={selectedUser.name}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">وظیفه</label>
        <input
          type="text"
          value={selectedUser.position}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">معینیت</label>
        <input
          type="text"
          value={selectedUser.deputyMinistry}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ریاست</label>
        <input
          type="text"
          value={selectedUser.directorate}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">تعداد تخلفات</label>
        <input
              type="text"
              value={selectedUser.violations}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
            />
      </div>

      <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع تخلف</label>
          <input
            type="text"
            value={selectedUser.comment}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
          />
        </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">امضای کارمند</label>
        <input
          type="text"
          value=""
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">امضای ریاست</label>
         <input
          type="text"
          value=""
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
        />
      </div>

      <div className="col-span-2">
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded shadow-md transition-all"
        >
          ثبت تخلف
        </button>
      </div>
    </>
  )}
</form>



        </div>
      </main>
    </div>
  );
}
