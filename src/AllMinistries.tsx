import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Building2 } from "lucide-react";
import GradientSidebar from "./components/Sidebar"; // adjust path if needed

interface Ministry {
  id: string;
  name: string;
}

export default function AllMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMinistries = async () => {
    try {
      const res = await axios.get("http://localhost:3000/deputy_ministries");
      setMinistries(res.data);
    } catch (err) {
      setError("Failed to fetch ministries");
    } finally {
      setLoading(false);
    }
  };

  const deleteMinistry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ministry?")) return;
    try {
      await axios.delete(`http://localhost:3000/deputy_ministries/${id}`);
      setMinistries((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <GradientSidebar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="text-blue-500 w-6 h-6" />
          <h1 className="text-2xl font-bold text-blue-700">All Deputy Ministries</h1>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Ministry Name</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ministries.map((ministry, index) => (
                  <tr key={ministry.id} className="border-t">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{ministry.name}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => alert("Implement edit logic")}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteMinistry(ministry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {ministries.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-sm text-gray-500">
                      No ministries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
