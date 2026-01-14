import { Link, NavLink } from "react-router";
import { useAuth, useFetch } from "@/hooks";
import { privateRoutes, publicRoutes } from "@/routes";
import { serviceRequest } from "@/services";

export const Navbar = () => {
  const { auth, logout } = useAuth();

  const { loading, callEndPoint } = useFetch();

  const routesToShow = !auth.id
    ? publicRoutes().filter((route) => route.path !== "*")
    : privateRoutes().filter(
        (route) =>
          route.path !== "*" &&
          route.path !== "/forbidden" &&
          route.path !== "/home" &&
          (route.allowedRoles.length === 0 ||
            auth.roles.some((role) => route.allowedRoles.includes(role.name))),
      );

  const handleLogout = async () => {
    const res = await callEndPoint(
      serviceRequest.postItem("/credential/logout"),
    );

    if (!loading && !res.error) {
      logout();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={auth.id ? "/home" : "/signin"}>
          CourierApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {routesToShow.map(
              ({ path, label }) =>
                label && (
                  <li key={path} className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "text-light fw-bold" : "text-secondary"} me-3`
                      }
                      to={path}
                    >
                      {label}
                    </NavLink>
                  </li>
                ),
            )}
          </ul>

          {auth.id && auth.fullName && (
            <div className="d-flex align-items-center ms-auto">
              <span className="text-light me-2">{auth.fullName}</span>
              <button
                className="btn btn-outline-light ms-auto"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
