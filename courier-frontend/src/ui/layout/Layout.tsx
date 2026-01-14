import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { withLoading } from "@/hoc";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
};

const WithLoadingLayout = withLoading(Layout);
export default WithLoadingLayout;
