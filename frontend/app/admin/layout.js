// The admin is its own installable app ("BHJ Admin"): separate manifest
// scoped to /admin, so installing it from the phone opens straight on the
// back-office, not on the public site.
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false, nocache: true },
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "BHJ Admin", statusBarStyle: "default" },
  icons: { apple: "/admin-icon-192.png" },
};

export const viewport = {
  themeColor: "#1a4d3e",
};

export default function AdminLayout({ children }) {
  return children;
}
