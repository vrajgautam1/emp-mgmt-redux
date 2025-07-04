import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { FaCrown, FaEye, FaTrash, FaMoon, FaSun } from "react-icons/fa";
import Header from "../../components/Header/Header";
import Asidebar from "../../components/Aside/Asidebar";
import Modal from "../../components/Modal/Modal";
import SalaryModal from "../../components/Modal/SalaryModal";
import {
    addSalary,
    deleteSalary,
} from "../../features/salary-slip/salarySlice";
import { openSalaryModal } from "../../features/modal/salaryModalSlice";

const Dashboard = () => {
    const [ranking, setRanking] = useState([]);
    const [salary, setSalary] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(true);

    const employees = useSelector((state) => state.employees.employees);
    const salarySlips = useSelector((state) => state.salarySlips.salaryArr);
    const { tasks } = useSelector((state) => state.tasks);
    const open = useSelector((state) => state.sidebar.open);
    const dispatch = useDispatch();

    useEffect(() => {
        const rankingInterval = setInterval(() => {
            const employeesWithRanking = employees.map((emp) => ({
                ...emp,
                ranking: Math.floor(Math.random() * 100) + 1,
            }));
            employeesWithRanking.sort((a, b) => b.ranking - a.ranking);
            setRanking(employeesWithRanking);
        }, 5000);
        return () => clearInterval(rankingInterval);
    }, [employees]);



    const handleChangeSalary = (e) => {
        const { name, value } = e.target;
        setSalary({ ...salary, [name]: value });
    };

    const handleSubmitSalary = (e) => {
        e.preventDefault();
        dispatch(addSalary({ ...salary, id: Date.now() }));
        setSalary({});
    };

    const handleDeleteSalary = (id) => dispatch(deleteSalary(id));
    const handleViewSlip = (empName) => {
        const selected = employees.find((emp) => emp.employeeName === empName);
        dispatch(openSalaryModal(selected));
    };

    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

    const getDepartmentData = (empArr) => {
        const counts = {};
        empArr.forEach((emp) => {
            const dept = emp.department || "Unknown";
            counts[dept] = (counts[dept] || 0) + 1;
        });
        return Object.keys(counts).map((key) => ({
            name: key,
            value: counts[key],
        }));
    };

    return (
        <div className={`d-flex min-vh-100 ${isDarkMode ? "dark-theme" : ""}`}>
  <Asidebar />

  <main
    className="flex-grow-1 overflow-auto p-4 position-relative"
    style={{
      marginLeft: open ? "70px" : "260px",
      transition: "margin-left 0.3s ease",
    }}
  >
    {/* Theme Toggle */}
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="theme-toggle position-absolute top-0 end-0 m-3"
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>

    {/* Header */}
    <Header />



    {/* Stat Cards */}
    <section className="row g-3 mb-4">
      <StatCard title="Employees" value={employees.length} />
      <StatCard title="Tasks" value={tasks.length} />
      <StatCard
        title="Completed"
        value={tasks.filter((t) => t.isDone).length}
        color="text-success"
      />
      <StatCard
        title="Pending"
        value={tasks.filter((t) => !t.isDone).length}
        color="text-warning"
      />
    </section>

    {/* 3-column layout */}
    <section className="row g-4">
      {/* Salary Slip Generator */}
      <div className="col-md-4">
        <div className="card-theme p-4">
          <h5 className="card-title">Generate Salary Slip</h5>
          <form onSubmit={handleSubmitSalary} className="d-grid gap-3">
            <select
              name="employeesSalarySlip"
              className="input-theme"
              onChange={handleChangeSalary}
            >
              <option>Select Employee</option>
              {employees.map((emp, i) => (
                <option key={i} value={emp.employeeName}>
                  {emp.employeeName}
                </option>
              ))}
            </select>

            <select
              name="month"
              className="input-theme"
              onChange={handleChangeSalary}
            >
              <option>Select Month</option>
              {[
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"
              ].map((m, i) => (
                <option key={i} value={m.toLowerCase()}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              placeholder="Year"
              className="input-theme"
              onChange={handleChangeSalary}
            />

            <button type="submit" className="btn-lavender">
              Generate
            </button>
          </form>
        </div>
      </div>

      {/* Recent Salary Slips */}
      <div className="col-md-4">
        <div className="card-theme p-4" style={{ maxHeight: 400, overflowY: "auto" }}>
          <h5 className="card-title">Recent Salary Slips</h5>
          {salarySlips.map((slip, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center list-item">
              <div>
                <div className={isDarkMode ? "text-light" : "text-dark"}>
                  {slip.employeesSalarySlip}
                </div>
                <small className="text-muted">{slip.month}, {slip.year}</small>
              </div>
              <div className="d-flex gap-2">
                <button
                  onClick={() => handleDeleteSalary(slip.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleViewSlip(slip.employeesSalarySlip)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="col-md-4">
        <div className="card-theme p-4">
          <h5 className="card-title">Top Performers</h5>
          <ul className="list-unstyled mb-0">
            {ranking.slice(0, 5).map((emp, i) => (
              <li key={i} className="list-item">
                <div className="fw-semibold">{emp.employeeName}</div>
                <small className="text-muted">{emp.department}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* Modals */}
    <Modal />
    <SalaryModal />
  </main>
</div>

    );
};

const StatCard = ({ title, value, color = "text-primary" }) => (
    <div className="col">
        <div className="card shadow-sm text-center">
            <div className="card-body">
                <p className="text-muted mb-1 small">{title}</p>
                <h5 className={`fw-bold ${color}`}>{value}</h5>
            </div>
        </div>
    </div>
);

export default Dashboard;
