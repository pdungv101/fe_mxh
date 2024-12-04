// pages/_app.js
import { useRouter } from "next/router";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import FollowedUsers from "../components/FollowedUsers";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/login" || router.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <div className="flex flex-grow">
        {!isAuthPage && <Sidebar />}
        <main className="flex-grow p-4">
          <Component {...pageProps} />
        </main>
        {!isAuthPage && (
          <aside>
            <FollowedUsers />
          </aside>
        )}
      </div>
    </div>
  );
}
