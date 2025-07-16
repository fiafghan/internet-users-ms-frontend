import { useState, useEffect } from "react";
import axios from "axios";
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
      bg- z-20">
        <GradientSidebar />
      </div>
      <main className="flex-1 px-6 py-10 bg-white">
      <div className="flex items-center justify-between mb-6">
        <img src="/moph.jpeg" alt="Logo Left" className="w-30 ml-80" />
        <img src="/emirate.png" alt="Logo Right" className="w-30 mr-10" />
      </div>

          <h1 className="text-center text-xl font-bold text-black mb-6">
            فورم تخطی استفاده کنندگان انترنت وزارت صحت عامه
          </h1>
  <form onSubmit={handleSubmit} dir="rtl" className="w-200px">
  {/* Search input */}
  <div className="mb-4 max-w-md relative">
    <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">نام یوزر:</label>
    <input
      id="username"
      type="text"
      placeholder="جستجو یوزر..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-3 py-2 border border-blue-300 rounded bg-white text-sm"
    />
    {searchTerm && (
      <ul className="absolute top-full mt-1 right-0 left-0 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto z-50">
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
    <table className=" border border-gray-300 rounded-md 
    text-sm bg-white table-auto table-layout-fixed border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 border border-gray-300 text-center">نام</th>
          <th className="px-3 py-2 border border-gray-300 text-center">وظیفه</th>
          <th className="px-3 py-2 border border-gray-300 text-center">معینیت</th>
          <th className="px-3 py-2 border border-gray-300 text-center">ریاست</th>
          <th className="px-3 py-2 border border-gray-300 text-center">تعداد تخلفات</th>
          <th className="px-3 py-2 border border-gray-300 text-center">توضیحات تخلف</th>
          <th className="px-3 py-2 border border-gray-300 text-center">امضای کارمند</th>
          <th className="px-3 py-2 border border-gray-300 text-center">امضای ریاست</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Now for the first 3 (header fields), just values centered */}
          <td className="px-3 py-2 border border-gray-300 text-center 
          whitespace-normal break-words text-center max-w-[20ch]">{selectedUser.name}</td>
          <td className="px-3 py-2 border border-gray-300 text-center 
          whitespace-normal break-words text-center max-w-[20ch]">{selectedUser.position}</td>
          <td className="px-3 py-2 border border-gray-300 text-center 
          whitespace-normal break-words text-center max-w-[20ch]">{selectedUser.deputyMinistry}</td>

          {/* The rest label + readonly input side by side in one cell each */}
          <td className="px-3 py-2 border border-gray-300
          whitespace-normal break-words text-center max-w-[20ch]">
            {selectedUser.directorate}
          </td>

          <td className="px-3 py-2 border border-gray-300
          whitespace-normal break-words max-w-xs text-center max-w-[20ch]">
            {selectedUser.violations}
          </td>

          <td className="px-3 py-2 border border-gray-300
          whitespace-normal break-words max-w-[20ch] text-center">
            {selectedUser.comment}
          </td>

          <td className="px-3 py-2 border border-gray-300">
            
          </td>

          <td className="px-3 py-2 border border-gray-300">
            
          </td>
        </tr>
      </tbody>
    </table>
  )}
</form>
      <div className="grid grid-cols-1">
        <h1 className="ml-100 mr-50 mt-5" dir = "rtl">کاربران انترنت در وزارت صحت عامه در صورتیکه دو مرتبه از انترنت استفاده نادرست نمایند یوزر شان برای همیشه مسدود می گردد!</h1>
        <h1 className="mx-auto mt-5" dir = "rtl">برای همیشه مسدود میگردد</h1>
        <h1 className="mx-auto mt-5" dir = "rtl">امضا رییس تکنالوژی معلوماتی</h1>
      </div>
      </main>
    </div>
  );
}
