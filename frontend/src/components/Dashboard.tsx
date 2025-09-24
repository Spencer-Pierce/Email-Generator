// src/components/Dashboard.tsx
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Email Generator</h1>
      <nav>
        <Link to="generate">Generate Email</Link> |{" "}
        <Link to="refine">Refine Email</Link> |{" "}
        <Link to="history">History</Link> |{" "}
        <Link to="/">Log out</Link>
      </nav>
      <hr />
      <Outlet /> {/* Nested routes render here */}
    </div>
  );
}
