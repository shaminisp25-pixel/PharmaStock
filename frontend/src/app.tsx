import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import DashboardPage from "./components/DashboardPage";
import InventoryPage from "./components/InventoryPage";
import OrdersPage from "./components/OrdersPage";
import PurchasePage from "./components/PurchasePage";
import ImportExportPage from "./components/ImportExportPage";
import ReportsPage from "./components/ReportsPage";
import CompliancePage from "./components/CompliancePage";
import AlertsPage from "./components/AlertsPage";
import AboutUsPage from "./components/AboutUsPage";
import ContactPage from "./components/ContactPage";

interface MenuItem {
  label: string;
  subItems?: { name: string; page?: string }[];
}

type UserRole = 'Admin' | 'Pharmacist' | 'Warehouse Staff' | 'Inspector' | null;

export default function App() {
  const [activeDropdown, setActiveDropdown] = useState<
    string | null
  >(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');

  const menuItems: MenuItem[] = [
    { label: "Home" },
    {
      label: "Dashboard",
      subItems: [
        { name: "Overview", page: "Dashboard-Overview" },
        { name: "Analytics", page: "Dashboard-Analytics" },
        { name: "Alerts", page: "Dashboard-Alerts" },
      ],
    },
    {
      label: "Inventory",
      subItems: [
        { name: "Stock List", page: "Inventory-Stock" },
        { name: "Batch Tracking", page: "Inventory-Batch" },
        { name: "Barcode Scan", page: "Inventory-Barcode" },
        { name: "Expiry Monitoring", page: "Inventory-Expiry" },
      ],
    },
    {
      label: "Orders",
      subItems: [
        { name: "All Orders", page: "Orders-All" },
        { name: "Pending", page: "Orders-Pending" },
        { name: "Completed", page: "Orders-Completed" },
      ],
    },
    {
      label: "Purchase",
      subItems: [
        { name: "Purchase Orders", page: "Purchase-Orders" },
        { name: "Vendors", page: "Purchase-Vendors" },
        { name: "Payments", page: "Purchase-Payments" },
      ],
    },
    {
      label: "Import/Export",
      subItems: [
        { name: "Import Data", page: "ImportExport-Import" },
        { name: "Validation", page: "ImportExport-Validation" },
        { name: "Export Reports", page: "ImportExport-Export" },
        { name: "Templates", page: "ImportExport-Templates" },
      ],
    },
    {
      label: "Reports",
      subItems: [
        { name: "Stock Summary", page: "Reports-Stock" },
        { name: "Expiry Reports", page: "Reports-Expiry" },
        { name: "Audit Logs", page: "Reports-Audit" },
      ],
    },
    {
      label: "Alerts",
      subItems: [
        { name: "Expired Items", page: "Alerts-Expired" },
        { name: "Near Expiry", page: "Alerts-NearExpiry" },
        { name: "Low Stock", page: "Alerts-LowStock" },
      ],
    },
    {
      label: "Compliance",
      subItems: [
        { name: "GMP", page: "Compliance-GMP" },
        { name: "CDSCO", page: "Compliance-CDSCO" },
        { name: "Documentation", page: "Compliance-Docs" },
      ],
    },
    {
      label: "About",
      subItems: [
        { name: "Our Story", page: "About-Story" },
        { name: "Team", page: "About-Team" },
        { name: "Careers", page: "About-Careers" },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePageChange = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = () => {
    setUserRole(selectedRole);
    setShowLoginModal(false);
    setActivePage('Dashboard-Overview');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActivePage('Home');
  };

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return (
          <HomePage
            isDarkMode={isDarkMode}
            onNavigate={handlePageChange}
          />
        );
      case "Dashboard":
      case "Dashboard-Overview":
      case "Dashboard-Analytics":
      case "Dashboard-Alerts":
        return (
          <DashboardPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Inventory":
      case "Inventory-Stock":
      case "Inventory-Batch":
      case "Inventory-Barcode":
      case "Inventory-Expiry":
        return (
          <InventoryPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Orders":
      case "Orders-All":
      case "Orders-Pending":
      case "Orders-Completed":
        return (
          <OrdersPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Purchase":
      case "Purchase-Orders":
      case "Purchase-Vendors":
      case "Purchase-Payments":
        return (
          <PurchasePage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Import/Export":
      case "ImportExport-Import":
      case "ImportExport-Upload":
      case "ImportExport-Validation":
      case "ImportExport-Export":
      case "ImportExport-Templates":
        return (
          <ImportExportPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Reports":
      case "Reports-Stock":
      case "Reports-Expiry":
      case "Reports-Dispatch":
      case "Reports-Audit":
        return (
          <ReportsPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Compliance":
      case "Compliance-GMP":
      case "Compliance-CDSCO":
      case "Compliance-Docs":
        return (
          <CompliancePage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Alerts":
      case "Alerts-Expired":
      case "Alerts-NearExpiry":
      case "Alerts-LowStock":
      case "Alerts-Expiring":
      case "Alerts-Notifications":
        return (
          <AlertsPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "About Us":
      case "About-Story":
      case "About-Team":
      case "About-Careers":
        return (
          <AboutUsPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Contact":
      case "Contact-Support":
      case "Contact-Sales":
      case "Contact-Feedback":
        return (
          <ContactPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      default:
        return <HomePage isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Sticky Navigation Bar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? `shadow-md ${isDarkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"} backdrop-blur-sm`
            : `${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => handlePageChange("Home")}
            >
              <img
                src="/src/imports/Gemini_Generated_Image_m8i7d1m8i7d1m8i7.png"
                alt="PharmaStock Logo"
                className={`h-10 transition-all ${
                  isDarkMode
                    ? "brightness-0 invert drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(167,139,250,0.7)]"
                    : "drop-shadow-sm group-hover:drop-shadow-md"
                }`}
                style={{
                  filter: isDarkMode
                    ? 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(167, 139, 250, 0.5))'
                    : 'none'
                }}
              />
            </div>

            {/* Centered Navigation Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.subItems &&
                    setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => handlePageChange(item.label)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                      activePage === item.label ||
                      activePage.startsWith(
                        item.label.replace("/", ""),
                      )
                        ? "text-[#14b8a6]"
                        : `${isDarkMode ? "text-gray-300 hover:text-[#14b8a6]" : "text-gray-700 hover:text-[#14b8a6]"}`
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg
                        className="w-3 h-3 transition-transform"
                        style={{
                          transform:
                            activeDropdown === item.label
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {item.subItems &&
                    activeDropdown === item.label && (
                      <div
                        className={`absolute top-full left-0 mt-1 w-48 ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } border rounded-lg shadow-lg z-50 overflow-hidden`}
                      >
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() =>
                              handlePageChange(
                                subItem.page || item.label,
                              )
                            }
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              isDarkMode
                                ? "text-gray-300 hover:bg-gray-700 hover:text-[#14b8a6]"
                                : "text-gray-700 hover:bg-gray-50 hover:text-[#14b8a6]"
                            }`}
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Right Side: Dark Mode Toggle + Login */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-100 text-gray-700"
                } hover:opacity-80`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Login/Logout Button */}
              {userRole ? (
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {userRole}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`px-6 py-2 rounded-full transition-all text-sm shadow-sm ${
                      isDarkMode
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                        : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600"
                    }`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`px-6 py-2 rounded-full transition-all text-sm shadow-sm ${
                    isDarkMode
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                  }`}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-8 ${
            isDarkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className={`text-2xl mb-2 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                Welcome to PharmaStock
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select your role to continue
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-6">
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Role
              </label>
              <div className="relative">
                <select
                  value={selectedRole || ''}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className={`w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 ${
                    isDarkMode ? 'focus:ring-purple-500/20' : 'focus:ring-indigo-500/20'
                  }`}
                >
                  <option value="Admin">Admin</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                  <option value="Inspector">Inspector</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Role Description */}
            <div className={`p-4 rounded-lg mb-6 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedRole === 'Admin' && 'Full system access with complete control over all modules and settings.'}
                {selectedRole === 'Pharmacist' && 'Focused on inventory management, stock levels, and medication tracking.'}
                {selectedRole === 'Warehouse Staff' && 'Access to stock operations, batch tracking, and order processing.'}
                {selectedRole === 'Inspector' && 'Compliance monitoring, audit logs, and regulatory documentation access.'}
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className={`w-full py-3 rounded-lg transition-all shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
              }`}
            >
              Login as {selectedRole}
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}