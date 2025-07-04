import React, { useEffect, useState } from "react";
import { FaBell, FaUserShield } from "react-icons/fa";

const Header = () => {
    const userName = "Vraj Gautam";
    const userInitial = userName.charAt(0);

    const [greetings, setGreetings] = useState("");
    const [currentDay, setCurrentDay] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        const options = { year: "numeric", month: "long", day: "numeric" };

        setGreetings(
            hours < 12
                ? "Good Morning"
                : hours < 18
                ? "Good Afternoon"
                : "Good Evening"
        );

        setCurrentDate(date.toLocaleDateString(undefined, options));
        setCurrentDay(date.toLocaleString("en-US", { weekday: "long" }));
    }, []);

    return (
        <header className="bg-white rounded shadow mb-4 px-4 py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                {/* Left - Logo and Greeting */}
                <div className="d-flex align-items-start flex-column gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-circle bg-gradient">
                            <FaUserShield size={40} color="black" />
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-dark">
                                {greetings}, Admin
                            </h4>
                            <small className="text-muted">
                                {currentDay}, {currentDate}
                            </small>
                        </div>
                    </div>
                </div>

                {/* Right - Notifications and User */}
                <div className="d-flex align-items-center gap-3">
                    <button className="btn position-relative p-2 bg-light rounded-circle shadow-sm">
                        <FaBell color="gray" size={18} />
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                    </button>

                    <div className="d-flex align-items-center gap-2">
                        <div
                            className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                            style={{ width: 40, height: 40 }}
                        >
                            {userInitial}
                        </div>
                        <div>
                            <p className="mb-0 fw-semibold text-dark">Admin User</p>
                            <small className="text-muted fw-bold">{userName}</small>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
