import AdminNavbar from "@/components/admin-navabr";
import AdminProtectedRoutes from "@/HOC/admin-protected-routes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="synthwave" lang="en">
      <body data-theme="synthwave">
        <AdminProtectedRoutes>
          <AdminNavbar />
          {children}
        </AdminProtectedRoutes>
      </body>
    </html>
  );
}
