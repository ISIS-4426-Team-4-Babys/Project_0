import React, { useState } from "react";

const userPhotoUrl = "https://i.pravatar.cc/40"; // Replace with actual user photo URL

export function Navbar() {
    const [darkMode, setDarkMode] = useState(false);

    React.useEffect(() => {
        document.body.className = darkMode ? "dark-mode" : "";
    }, [darkMode]);

    return (
        <nav
            style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 2rem",
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
            boxShadow: "0 0 16px 4px rgba(0,0,0,0.10)",
            }}
        >
            <div style={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src="/icon.png" alt="Brand Icon" style={{ width: 28, height: 28 }} />
            My Tasks
            </div>
        </nav>
    );
}