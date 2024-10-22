import Navbar from "@/components/navabr";
import JobSeekerProtectedRoutes from "@/HOC/job-seeker-protected-routes";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <JobSeekerProtectedRoutes>
                    <Navbar />
                    {children}
                </JobSeekerProtectedRoutes>
            </body>
        </html>
    );
}