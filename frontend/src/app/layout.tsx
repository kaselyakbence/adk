import "../main.css";
import UsernameProvider from "../context/UsernameProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div id="root">
          <UsernameProvider>{children}</UsernameProvider>
        </div>
      </body>
    </html>
  );
}
