// src\app\login\page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
    const router = useRouter();
    const [shop, setShop] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Get 'shop' from URL parameters
        const params = new URLSearchParams(window.location.search);
        const shopFromURL = params.get("shop");

        if (shopFromURL) {
            setShop(shopFromURL); // Set shop value in input field
        }
    }, []);

    const handleLogin = async () => {
        if (!shop.trim() || !password.trim()) {
            setError("Please enter both store name and password.");
            return;
        }
        setError("");

        localStorage.setItem("shop", shop.trim());
        localStorage.setItem("password", password.trim());

        Cookies.set("shop", shop.trim(), { expires: 7 });
        Cookies.set("password", password.trim(), { expires: 7 });

        router.push(`/api/auth/?shop=${shop.trim()}`);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login to Your Shopify App</h1>
                <input
                    type="text"
                    placeholder="your-store-name.myshopify.com"
                    value={shop}
                    onChange={(e) => setShop(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
