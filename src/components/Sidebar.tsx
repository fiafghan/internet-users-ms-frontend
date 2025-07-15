import { useNavigate } from "react-router-dom";
import { User, Settings, AlertOctagon, Users, Gavel, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import type { JSX } from "react";

export default function GradientSidebar(): JSX.Element {
  const navigate = useNavigate();

  const items = [
    { id: 1, label: "All Users", icon: <Users className="w-5 h-5" />, path: "/" },
    { id: 2, label: "Add User", icon: <User className="w-5 h-5" />, path: "/adduser" },
    { id: 3, label: "All Violations", icon: <Gavel className="w-5 h-5" />, path: "/violations" },
    { id: 4, label: "Add Violation", icon: <AlertOctagon className="w-5 h-5" />, path: "/addviolation" },
    { id: 5, label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
    { id: 6, label: "Logout", icon: <LogOut className="w-5 h-5" />, path: "/logout" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-400 text-white flex flex-col">
      <div className="flex items-center justify-center flex-col py-6 px-4">
        <img src="moph.jpeg" className="rounded-full w-30 shadow-xl shadow-white border-1" />
        <h1 className="text-center mt-5">IUMS</h1>
      </div>

      <nav className="flex flex-col mt-8 gap-1 px-4">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.04, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white 
              hover:text-blue-400 hover:shadow-sm hover:shadow-white 
              transition text-sm font-medium"
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </aside>
  );
}
