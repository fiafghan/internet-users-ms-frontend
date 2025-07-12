import { Sidebar, User, Settings, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function GradientSidebar(): JSX.Element {
  const items = [
    { id: 1, label: "Dashboard", icon: <Sidebar className="w-5 h-5" /> },
    { id: 2, label: "Users", icon: <User className="w-5 h-5" /> },
    { id: 3, label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { id: 4, label: "Logs", icon: <Cpu className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-purple-700 via-indigo-800 to-blue-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        MyApp
      </div>
      <nav className="flex flex-col mt-8 gap-1 px-4">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, opacity: 1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </aside>
  );
}
