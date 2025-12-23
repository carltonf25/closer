import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
