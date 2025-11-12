import "./globals.css";

export const metadata = {
  title: "ExpenseEase",
  description: "Simple Receipt Uploads, Smarter Expense Tracking.",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
