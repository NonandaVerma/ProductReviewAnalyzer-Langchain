import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

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
        <Header />
        <Sidebar />
        <main className="pt-[92px] pl-20 lg:pl-72 pr-6 pb-12 transition-all max-w-[1440px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
