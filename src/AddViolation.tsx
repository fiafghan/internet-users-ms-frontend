import { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertTriangle } from "lucide-react";
import GradientSidebar from "./components/Sidebar";

interface InternetUser {
  id: string;
  name: string;
  username: string;
}

export default function AddViolation() {
  const [users, setUsers] = useState<InternetUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<InternetUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<InternetUser | null>(null);
  const [comment, setComment] = useState("");
  const [violationCount, setViolationCount] = useState("1");

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
      comment,
      violation_count: parseInt(violationCount)
    };

    try {
      await axios.post("http://localhost:3000/internet_users", violationData);
      alert("Violation submitted successfully!");
      setSearchTerm("");
      setComment("");
      setViolationCount("1");
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
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-xl mx-auto bg-white rounded-md shadow-md border p-6">
          <h1 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Add Violation
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-blue-300 rounded shadow-sm \
                focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
              />
              <Search className="absolute left-3 top-11 transform -translate-y-1/2 
              text-blue-400 w-4 h-4" />
              {searchTerm && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 \
                rounded shadow max-h-40 overflow-y-auto">
                  {filteredUsers.map(user => (
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

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-blue-300 rounded shadow-sm focus:outline-none \
                focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>

            <div>
              <label htmlFor="violations" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Violations
              </label>
              <select
                id="violations"
                value={violationCount}
                onChange={(e) => setViolationCount(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded shadow-sm focus:outline-none \
                focus:ring-2 focus:ring-blue-400"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-400 hover:bg-blue-300 text-white rounded shadow-md"
            >
              Submit Violation
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
