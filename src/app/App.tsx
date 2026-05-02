import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import DashboardPage from "./components/DashboardPage";
import InventoryPage from "./components/InventoryPage";
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

export default function App() {
  const [activeDropdown, setActiveDropdown] = useState<
    string | null
  >(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

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
      ],
    },
    {
      label: "Import/Export",
      subItems: [
        { name: "Upload Data", page: "ImportExport-Upload" },
        { name: "Export Reports", page: "ImportExport-Export" },
        { name: "Templates", page: "ImportExport-Templates" },
      ],
    },
    {
      label: "Reports",
      subItems: [
        { name: "Expiry Reports", page: "Reports-Expiry" },
        { name: "Dispatch Logs", page: "Reports-Dispatch" },
        { name: "Audit Logs", page: "Reports-Audit" },
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
      label: "Alerts",
      subItems: [
        { name: "Low Stock", page: "Alerts-LowStock" },
        { name: "Expiring Items", page: "Alerts-Expiring" },
        { name: "Notifications", page: "Alerts-Notifications" },
      ],
    },
    {
      label: "About Us",
      subItems: [
        { name: "Our Story", page: "About-Story" },
        { name: "Team", page: "About-Team" },
        { name: "Careers", page: "About-Careers" },
      ],
    },
    {
      label: "Contact",
      subItems: [
        { name: "Support", page: "Contact-Support" },
        { name: "Sales", page: "Contact-Sales" },
        { name: "Feedback", page: "Contact-Feedback" },
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

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <HomePage isDarkMode={isDarkMode} />;
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
        return (
          <InventoryPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Import/Export":
      case "ImportExport-Upload":
      case "ImportExport-Export":
      case "ImportExport-Templates":
        return (
          <ImportExportPage
            isDarkMode={isDarkMode}
            subPage={activePage.split("-")[1]}
          />
        );
      case "Reports":
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
              className="flex items-center cursor-pointer"
              onClick={() => handlePageChange("Home")}
            >
              <img
                src="/src/imports/Gemini_Generated_Image_m8i7d1m8i7d1m8i7.png"
                alt="PharmaStock Logo"
                className={`h-9 transition-all ${isDarkMode ? "brightness-0 invert" : ""}`}
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

              {/* Login Button */}
              <button className="bg-[#1e3a5f] text-white px-6 py-2 rounded-full hover:bg-[#2d4a6f] transition-colors text-sm shadow-sm">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="transition-all duration-300">
        {renderPage()}
      </main>
    </div>
  );
}