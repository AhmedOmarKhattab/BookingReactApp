import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";



export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
    <Navbar/>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
