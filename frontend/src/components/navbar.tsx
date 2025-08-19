import { set } from "date-fns";
import React, { useState } from "react";


export function Navbar({ user, setToken }: { user: any, setToken: (token: string | null) => void }) {
    const [menuOpen, setMenuOpen] = useState(false);

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
            background: "#fff",
            color: "#222",
            boxShadow: "0 0 16px 4px rgba(0,0,0,0.10)",
            }}
        >
            <div style={{ fontWeight: "bold", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src="/icon.png" alt="Brand Icon" style={{ width: 28, height: 28 }} />
            My Tasks
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
                <img
                    src={user.profile_image}
                    alt="User Profile"
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                    }}
                    onClick={() => setMenuOpen((open) => !open)}
                />
                {menuOpen && (
                    <div
                        style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: 8,
                            padding: "1rem",
                            minWidth: 180,
                            width: "max-content",
                            zIndex: 1001,
                        }}
                    >
                        <div style={{ marginBottom: "0.75rem" }}>
                            Hola, <strong>{user.username}</strong>!
                        </div>
                        <button
                            style={{
                                background: "#3b82f6",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                padding: "0.5rem 1rem",
                                cursor: "pointer",
                                width: "100%",
                            }}
                            onClick={() => {
                                setToken(null);
                                localStorage.removeItem("api_token");
                                localStorage.removeItem("user");
                                window.location.reload();
                            }}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}