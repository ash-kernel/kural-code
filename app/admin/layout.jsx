export const metadata = {
  title: 'Thirukkural API - Admin',
  description: 'Admin Panel for Kural API',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg">
      {children}
    </div>
  );
}
