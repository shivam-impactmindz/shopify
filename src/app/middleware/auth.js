// // src/middleware/auth.js
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/app/lib/database";
// import Session from "@/app/models/session";
// import crypto from "crypto";

// const SECRET_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET;

// function verifyHmac(shop, hmac) {
//   const generatedHmac = crypto.createHmac("sha256", SECRET_KEY).update(shop).digest("hex");
//   return generatedHmac === hmac;
// }

// export async function middleware(req) {
//   const shop = req.cookies.get("shop")?.value;
//   const url = new URL(req.url);
//   const hmac = url.searchParams.get("hmac");

//   if (!shop || !hmac || !verifyHmac(shop, hmac)) {
//     console.error("Invalid shop or HMAC");
//     return NextResponse.redirect("/login");
//   }

//   await connectToDatabase();
//   const session = await Session.findOne({ shop });

//   if (!session || !session.accessToken) {
//     console.error("Session not found or invalid", { shop });
//     return NextResponse.redirect("/login");
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/products", "/about", "/contact"],
// };








// src/middleware/auth.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/database";
import Session from "@/app/models/session";

export async function middleware(req) {
  const shop = req.cookies.get("shop")?.value;
  if (!shop) {
    console.log("ye chal raha hai");  
    return NextResponse.redirect("/login"); // Redirect to login if no shop in cookies
  }

  // Connect to database and verify session
  await connectToDatabase();
  const session = await Session.findOne({ shop });

  if (!session || !session.accessToken) {
    return NextResponse.redirect("/login"); // Redirect if session not valid
  }

  return NextResponse.next(); // Proceed if session is valid
}

export const config = {
  matcher: ["/products", "/about", "/contact"],
};
