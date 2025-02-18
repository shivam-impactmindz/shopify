// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const Header = () => {
//   const router = useRouter();
//   const [shop, setShop] = useState("");
//   const [redirectUrl, setRedirectUrl] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedShop = localStorage.getItem("shop");
//       if (storedShop) {
//         setShop(storedShop);
//         fetch("/api/products/link")
//           .then((res) => {
//             if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//             return res.json();
//           })
//           .then((data) => {
//             if (data?.message && typeof data.message === "string") {
//               setRedirectUrl(data.message);
//             } else {
//               console.error("Invalid API response format:", data);
//             }
//           })
//           .catch((error) => {
//             console.error("Fetch error:", error);
//             router.push("/login"); // Redirect to login if there's an error
//           });
//       } else {
//         router.push("/login"); // Redirect to login if shop is not set
//       }
//     }
//   }, []);

//   const handleProductsClick = async (e) => {
//     e.preventDefault();
//     if (!shop) return router.push("/");
//     try {
//       const response = await fetch("/api/verify-shop", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ shop }),
//       });
//       const data = await response.json();
//       if (redirectUrl && typeof redirectUrl === "string") {
//         router.push(redirectUrl);
//       } else {
//         console.error("Redirect URL is invalid:", redirectUrl);
//       }
//     } catch (error) {
//       console.error("Error verifying shop:", error);
//     }
//   };

//   return (
//     <header className="header">
//       <div className="header-container">
//         <h1 className="logo">
//           <Link href="/login">Next Shopify App</Link>
//         </h1>
//         <nav>
//           <ul className="nav-links">
//             <li><Link href="/">Home</Link></li>
//             <li><a href="#" onClick={handleProductsClick}>Products</a></li>
//             <li><Link href="/about">About</Link></li>
//             <li><Link href="/contact">Contact</Link></li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;



// src\app\components\Header.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

const Header = () => {
  const router = useRouter();
  const [shop, setShop] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    // Retrieve the 'shop' and 'hmac' cookies
    const shopCookie = Cookies.get('shop');
    const hmacCookie = Cookies.get('hmac');

    console.log("Shop Cookie:", shopCookie);
    console.log("HMAC Cookie:", hmacCookie);

    if (shopCookie) {
      fetch("/api/products/link")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data?.message && typeof data.message === "string") {
            setRedirectUrl(data.message);
          } else {
            console.error("Invalid API response format:", data);
          }
        })
        .catch((error) => console.error("Fetch error:", error));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedShop = localStorage.getItem("shop");
      if (storedShop) setShop(storedShop);
    }
  }, []);

  const handleProductsClick = async (e) => {
    e.preventDefault();
    if (!shop) return router.push("/");

    try {
      const response = await fetch("/api/verify-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      });

      const data = await response.json();

      if (redirectUrl && typeof redirectUrl === "string") {
        router.push(redirectUrl);
      } else {
        console.error("Redirect URL is invalid:", redirectUrl);
      }
    } catch (error) {
      console.error("Error verifying shop:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">
          <Link href="/">Next Shopify App</Link>
        </h1>
        <nav>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><a href="#" onClick={handleProductsClick}>Products</a></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
