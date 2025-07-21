import { useNavigate } from "react-router-dom";
import {
  User, Settings, AlertOctagon, Users, LogOut,
  Building2, ChevronDown, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { JSX } from "react";

export default function GradientSidebar(): JSX.Element {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const isAdmin = currentUser?.isAdmin === true;

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (id: number) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const items = [
    { id: 1, label: "All Users", icon: <Users className="w-5 h-5" />, path: "/" },
    { id: 2, label: "Add User", icon: <User className="w-5 h-5" />, path: "/adduser" },
    { id: 3, label: "Violation Form", icon: <AlertOctagon className="w-5 h-5" />, path: "/addviolation" },

    {
      id: 7,
      label: "Deputy Ministries",
      icon: <Building2 className="w-5 h-5" />,
      children: [
        { id: 71, label: "All Deputy Ministries", path: "/alldeputyministries" },
        { id: 72, label: "New Deputy Ministry", path: "/newdeputyministry" },
      ]
    },

    {
      id: 9,
      label: "Directorates",
      icon: <Building2 className="w-5 h-5" />,
      children: [
        { id: 91, label: "All Directorates", path: "/alldirectorates" },
        { id: 92, label: "New Directorate", path: "/newdirectorate" },
      ]
    },

    ...(isAdmin ? [{
      id: 4, label: "Add System User", icon: <User className="w-5 h-5" />, path: "/register"
    }] : []),

    ...(isAdmin ? [{
      id: 5, label: "All System Users", icon: <Users className="w-5 h-5" />, path: "/all-system-users"
    }] : []),

    { id: 6, label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-400 text-white flex flex-col">
      <div className="flex items-center justify-center flex-col py-6 px-4">
        <img src="moph.jpeg" className="rounded-full w-30 border-1" />
        <h1 className="text-center mt-5">IUMS</h1>
      </div>

      <nav className="flex flex-col mt-8 gap-1 px-4">
        {items.map(item => (
          <div key={item.id}>
            {/* Parent item with dropdown logic */}
            {item.children ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.04, opacity: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMenu(item.id)}
                  className="flex items-center justify-between px-4 py-3 rounded-sm hover:bg-white 
                    hover:text-blue-400 hover:shadow-sm hover:shadow-white 
                    transition text-sm font-medium w-full"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {openMenus[item.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </motion.button>

                {/* Child routes shown conditionally */}
                {openMenus[item.id] && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {item.children.map(child => (
                      <motion.button
                        key={child.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate(child.path)}
                        className="text-left px-3 py-2 text-sm rounded-sm bg-blue-300 hover:bg-white hover:text-blue-500 transition"
                      >
                        {child.label}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <motion.button
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
            )}
          </div>
        ))}

        {/* 🔒 Logout */}
        <motion.button
          whileHover={{ scale: 1.04, opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-sm hover:bg-white 
            hover:text-blue-400 hover:shadow-sm hover:shadow-white 
            transition text-sm font-medium mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </motion.button>
      </nav>
    </aside>
  );
}
