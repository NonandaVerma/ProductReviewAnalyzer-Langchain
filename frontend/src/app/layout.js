import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'ProductReviewAnalyzer | PM Decision Hub',
  description: 'AI-Powered Product Review Analysis & RAG Assistant Platform',
  icons: {
    icon: '/pmLogo.png',
    shortcut: '/pmLogo.png',
    apple: '/pmLogo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans bg-[#F4F7FE] text-[#2B3674] antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
