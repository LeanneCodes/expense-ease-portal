import "./globals.css";

export const metadata = {
  title: "ExpenseEase",
  description: "Simple Receipt Uploads, Smarter Expense Tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
