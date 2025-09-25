// src/components/Dashboard.tsx
import { Link, Outlet } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Email Generator</h1>
      <nav>
        <Link className="dashboard-text" to="generate">Generate Email</Link> |{" "}
        <Link className="dashboard-text" to="refine">Refine Email</Link> |{" "}
        <Link className="dashboard-text" to="history">History</Link> |{" "}
        <Link className="dashboard-text" to="/">Log out</Link>
      </nav>
      <hr />
      <Outlet /> {/* Nested routes render here */}
    </div>
  );
}
