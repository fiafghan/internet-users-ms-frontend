import { User, Settings, AlertOctagon, Users, Gavel, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import type { JSX } from "react";



export default function GradientSidebar(): JSX.Element {

  const items = [
    { id: 1, label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: 2, label: "All Users", icon: <Users className="w-5 h-5" /> },
    { id: 3, label: "Add User", icon: <User className="w-5 h-5" /> },
    { id: 4, label: "All Violations", icon: <Gavel className="w-5 h-5" /> },
    { id: 5, label: "Add Violation", icon: <AlertOctagon className="w-5 h-5" /> },
    { id: 6, label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { id: 7, label: "Logout", icon: <LogOut className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-400
    text-white flex flex-col">
      <div className="flex items-center justify-center flex-col py-6 px-4">
            <img src="moph.jpeg" className="rounded-full w-30 
            shadow-xl shadow-white border-1"></img>
        <h1 className="text-center mt-5 ">IUMS</h1>
      </div>
      <nav className="flex flex-col mt-8 gap-1 px-4">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.04, opacity: 0.9 }}
            whileTap={{ scale: 0.50 }}
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
