import Footer from "./Footer";
import Header from "./Header";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  // Sidebar items list
  const menuItems = [
    { name: "History", path: "/history" },
    { name: "Liked Videos", path: "/liked-video" },
    { name: "My Content", path: "/my-content" },
    { name: "Subcriber", path: "/subscribers" },
  ];

  return (
    <>
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-14 left-0 bg-white shadow-md w-40 h-screen p-4">
          <h2 className="font-bold text-red-600 mb-4">Menu</h2>
          <ul className="space-y-3">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="block px-2 py-1 rounded hover:bg-red-100 hover:text-red-600 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-40 p-4">{children}</main>
      </div>

      <Footer />
    </>
  );
};

export default Layout;
