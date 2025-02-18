// src\app\products\page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import crypto from "crypto";
import "@/app/styles/products.css";

const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;

export default function ProductsPage() {
  const [isValidShop, setIsValidShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const verifyShopAndFetchProducts = async () => {
      const params = new URLSearchParams(window.location.search);
      const shop = localStorage.getItem("shop");
      const shopFromURL = params.get("shop");
      const hmac = params.get("hmac");

      console.log("Shop from URL:", shopFromURL);
      console.log("Shop from localStorage:", shop);
      console.log("HMAC from URL:", hmac);

      if (!shopFromURL || !hmac) {
        router.replace(`/login?shop=${shopFromURL || ""}`);
        return;
      }

      if (shop !== shopFromURL) {
        router.replace(`/login?shop=${shopFromURL}`);
        return;
      }

      // Generate HMAC on the client side
      const generatedHmac = crypto.createHmac("sha256", SECRET_KEY).update(shop).digest("hex");
      if (generatedHmac !== hmac) {
        console.error("HMAC mismatch: Invalid shop credentials");
        router.replace(`/login?shop=${shopFromURL}`);
        return;
      }

      try {
        const verifyResponse = await fetch("/api/verify-shop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shop, hmac }),
        });

        const verifyData = await verifyResponse.json();
        if (!verifyData.isValid) {
          setIsValidShop(false);
          router.replace("/");
          return;
        }

        setIsValidShop(true);

        // Fetch products
        const productsResponse = await fetch(`/api/products?shop=${shop}`);
        const productsData = await productsResponse.json();

        setProducts(productsData.products || []);
      } catch (error) {
        console.error("Error verifying shop or fetching products:", error);
        setIsValidShop(false);
      } finally {
        setLoading(false);
      }
    };

    verifyShopAndFetchProducts();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (isValidShop === false) return <p>Shop validation failed. Redirecting...</p>;

  return (
    <div className="products-container">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image?.src || "/placeholder.jpg"}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <p className="product-title">{product.title}</p>
                <p className="product-price">
                  ₹{product.variants[0]?.price || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}









// src\app\products\page.js
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import crypto from "crypto";
// import "@/app/styles/products.css";

// const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;

// export default function ProductsPage() {
//   const [isValidShop, setIsValidShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const verifyShopAndFetchProducts = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const timestamp = searchParams.get('timestamp');
//       const shopFromURL = params.get("shop");
//       const hmac = params.get("hmac");

//       console.log("Shop from URL:", shopFromURL);
//       console.log("HMAC from URL:", hmac);

//       if ((timestamp && shop && hmac)){
        
//       }
//       if (!shopFromURL || !hmac) {
//         router.replace(`/login?shop=${shopFromURL || ""}`);
//         return;
//       }

//       // Generate HMAC on the client side
//       const generatedHmac = crypto.createHmac("sha256", SECRET_KEY).update(shopFromURL).digest("hex");
//       if (generatedHmac !== hmac) {
//         console.error("HMAC mismatch: Invalid shop credentials");
//         router.replace(`/login?shop=${shopFromURL}`);
//         return;
//       }

//       try {
//         const verifyResponse = await fetch("/api/verify-shop", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ shop: shopFromURL, hmac }),
//         });

//         const verifyData = await verifyResponse.json();
//         if (!verifyData.isValid) {
//           setIsValidShop(false);
//           router.replace("/");
//           return;
//         }

//         setIsValidShop(true);

//         // Fetch products for the specific store
//         const productsResponse = await fetch(`/api/products?shop=${shopFromURL}`);
//         const productsData = await productsResponse.json();

//         setProducts(productsData.products || []);
//       } catch (error) {
//         console.error("Error verifying shop or fetching products:", error);
//         setIsValidShop(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyShopAndFetchProducts();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;
//   if (isValidShop === false) return <p>Shop validation failed. Redirecting...</p>;

//   return (
//     <div className="products-container">
//       <h1>Products</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="products-grid">
//           {products.map((product) => (
//             <div key={product.id} className="product-card">
//               <img
//                 src={product.image?.src || "/placeholder.jpg"}
//                 alt={product.title}
//                 className="product-image"
//               />
//               <div className="product-info">
//                 <p className="product-title">{product.title}</p>
//                 <p className="product-price">
//                   ₹{product.variants[0]?.price || "N/A"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import crypto from "crypto";
// import "@/app/styles/products.css";

// const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;

// export default function ProductsPage() {
//   const [isValidShop, setIsValidShop] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const verifyShopAndFetchProducts = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const timestamp = params.get("timestamp");
//       const shopFromURL = params.get("shop");
//       const hmac = params.get("hmac");


//       if (timestamp && shopFromURL && hmac) {
//         console.error("teeno chij mile gye");

//         try {
//           const verifyResponse = await fetch("/api/check-shop", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ shop: shopFromURL }),
//           });
//           console.log("verifyResponse", verifyResponse);

//           const verifyData = await verifyResponse.json();

//           if (verifyData.exists) {
//             Cookies.set("shop", shopFromURL);
//             Cookies.set("hmac", hmac);
//             const productsResponse = await fetch(`/api/products?shop=${shopFromURL}`);
//             const productsData = await productsResponse.json();
//             setProducts(productsData.products || []);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error("Error checking shop from MongoDB:", error);
//         }
//       }

//       if (!shopFromURL || !hmac) {
//         router.replace(`/login?shop=${shopFromURL || ""}`);
//         return;
//       }

//       const generatedHmac = crypto.createHmac("sha256", SECRET_KEY).update(shopFromURL).digest("hex");
//       if (generatedHmac !== hmac) {
//         console.error("HMAC mismatch: Invalid shop credentials");
//         router.replace(`/login?shop=${shopFromURL}`);
//         return;
//       }

//       try {
//         const verifyResponse = await fetch("/api/verify-shop", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ shop: shopFromURL, hmac }),
//         });
//         const verifyData = await verifyResponse.json();
//         if (!verifyData.isValid) {
//           setIsValidShop(false);
//           router.replace("/");
//           return;
//         }
//         setIsValidShop(true);
//         const productsResponse = await fetch(`/api/products?shop=${shopFromURL}`);
//         const productsData = await productsResponse.json();
//         setProducts(productsData.products || []);
//       } catch (error) {
//         console.error("Error verifying shop or fetching products:", error);
//         setIsValidShop(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyShopAndFetchProducts();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;
//   if (isValidShop === false) return <p>Shop validation failed. Redirecting...</p>;

//   return (
//     <div className="products-container">
//       <h1>Products</h1>
//       {products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="products-grid">
//           {products.map((product) => (
//             <div key={product.id} className="product-card">
//               <img
//                 src={product.image?.src || "/placeholder.jpg"}
//                 alt={product.title}
//                 className="product-image"
//               />
//               <div className="product-info">
//                 <p className="product-title">{product.title}</p>
//                 <p className="product-price">
//                   ₹{product.variants[0]?.price || "N/A"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }