export const metadata = {
    title: 'CatchWise | Company',
    description: 'Welcome to your dashboard',
  };

export default function CompanyLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>{children}</>
    );
};