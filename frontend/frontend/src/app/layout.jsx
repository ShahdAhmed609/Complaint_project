// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Complaint System",
  description: "Student Complaint Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
