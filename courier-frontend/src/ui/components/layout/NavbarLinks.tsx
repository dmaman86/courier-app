import { NavLink } from "react-router-dom";


export const NavbarLinks = ({ links }: { links: any[] }) => (
    links.length > 0 && links.map((link, index) => (
      <li key={index} className="nav-item">
        <NavLink
          to={link.path}
          className={({ isActive }) => 'nav-link ' + (isActive ? 'active' : '')}
        >
          {link.label}
        </NavLink>
      </li>
    ))
  );