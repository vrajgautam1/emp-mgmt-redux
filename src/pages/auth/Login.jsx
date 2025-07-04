import React, { useEffect, useState } from "react";
import { BiLogIn } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [role, setRole] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  const { isLoggedIn } = useSelector((state) => state.login);
  const employees = useSelector((state) => state.employees.employees);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (role === "admin") {
        navigate("/DashBoard");
      } else {
        navigate("/UserDashboard", { state: { selectedEmail: employeeEmail } });
      }
    }
  }, [isLoggedIn, role, employeeEmail, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "admin") {
      if (!adminEmail) return toast.error("Please enter admin email");
      dispatch(loginUser({ role, email: adminEmail }));
    } else {
      if (!employeeEmail) return toast.error("Please select an employee email");
      dispatch(loginUser({ role, email: employeeEmail }));
    }

    toast.success("Logging in Successfully");
  };

  return (
    <section
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
      }}
    >
      <div
        className="shadow-lg p-4 rounded-4 bg-white border border-light w-100"
        style={{
          maxWidth: "420px",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center mb-4">
          <IoPersonCircleOutline size={60} className="text-primary mb-2" />
          <h4 className="fw-bold mb-1">
            Welcome {role === "admin" ? "Admin" : "Employee"}
          </h4>
          <small className="text-muted">Please login to continue</small>
        </div>

        <form onSubmit={handleLogin} className="d-grid gap-3">
          {role === "admin" ? (
            <div>
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="form-label">Select Employee Email</label>
              <select
                className="form-select rounded-3"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
              >
                <option value="">-- Select Email --</option>
                {employees.length > 0 ? (
                  employees.map((emp, i) => (
                    <option key={i} value={emp.email}>
                      {emp.email}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading...</option>
                )}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="d-flex justify-content-center gap-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="admin"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label" htmlFor="admin">
                Admin
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="employee"
                value="employee"
                checked={role === "employee"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label" htmlFor="employee">
                Employee
              </label>
            </div>
          </div>

          <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 mt-2">
            Login <BiLogIn size={20} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
