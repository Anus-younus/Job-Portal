import AdminNavbar from "@/components/admin-navabr";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html data-theme="synthwave" lang="en">
        <body data-theme="synthwave">
            <AdminNavbar />
            {children}
        </body>
      </html>
    );
  }
  