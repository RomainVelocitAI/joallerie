import './globals.css';

export const metadata = {
  title: 'Dashboard Joaillerie',
  description: 'Tableau de bord pour la gestion de la joaillerie',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
