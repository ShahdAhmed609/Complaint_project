export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* sidebar*/}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <a href="/admin" className="hover:underline">Home</a>
          </li>
          <li>
            <a href="/admin/complaints" className="hover:underline">Complaints</a>
          </li>
          <li>
            <a href="/admin/suggestions" className="hover:underline">Suggestions</a>
          </li>
          
        </ul>
      </aside>

      {/* main content */}
      <main className="flex-1 bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}
