"use client"
import Navbar from "@/components/navabr";
import ComppanyProtectedRoutes from "@/HOC/company-protected-routes";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html data-theme="synthwave" lang="en">
            <body>
               <ComppanyProtectedRoutes>
                    <Navbar company={true} />
                    {children}
                </ComppanyProtectedRoutes>
            </body>
        </html>
    );
}