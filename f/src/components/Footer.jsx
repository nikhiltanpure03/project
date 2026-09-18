import { Link, useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  return (
    <footer className="site-footer">
      <Link to="/">Back to home</Link>
    </footer>
  );
}

export default Footer;
