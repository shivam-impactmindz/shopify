// src/app/api/products/link/route.js


// export async function GET() {
//   return NextResponse.json({ message: "https://your-shopify-store.com/products" });
// }


// // src\app\api\products\link\route.js
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// export async function GET(request) { // Accept `request` as a parameter
//   // Get `shop` and `hmac` from cookies
//   const cookieStore = cookies();
//   const shop = cookieStore.get("shop")?.value || "";
//   const hmac = cookieStore.get("hmac")?.value || "";
//   // Extract `host` from the request's search parameters
//   const { searchParams } = new URL(request.url);
//   const host1 = searchParams.get("host");
//   // Get `host` from .env
//   const host = process.env.NEXT_PUBLIC_HOST;
//   if (!shop || !hmac) {
//     return NextResponse.json({ error: "Missing shop or hmac" }, { status: 400 });
//   }
//   // Construct the URL
//   const redirectUrl = `${host}/products?host=${host1}&shop=${shop}&hmac=${hmac}`;
//   return NextResponse.json({ message: redirectUrl });
// }

// src\app\api\products\link\route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  // Get cookies
  const cookieStore = cookies();
  const shop = cookieStore.get("shop")?.value || "";
  const hmac = cookieStore.get("hmac")?.value || "";

  // Extract `host` safely
  const url = new URL(request.url, process.env.NEXT_PUBLIC_HOST);
  const host1 = url.searchParams.get("host");

  // Get `host` from .env
  const host = process.env.NEXT_PUBLIC_HOST;

  if (!shop || !hmac) {
    return NextResponse.json({ error: "Missing shop or hmac" }, { status: 400 });
  }

  // Construct the redirect URL
  const redirectUrl = `${host}/products?host=${host1}&shop=${shop}&hmac=${hmac}`;
  
  return NextResponse.json({ message: redirectUrl });
}


// https://95f1-223-185-56-236.ngrok-free.app/products?host=YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvbmV3dGVzdHN0b3JlNTY&shop=newteststore56.myshopify.com&hmac=3bfc8cc15c5caaac9eb8e3bf8dba8cfaf5e39e9a0ab0c859a1594ecfccca1d14
// https://95f1-223-185-56-236.ngrok-free.app/products&shop=newteststore56.myshopify.com&hmac=3bfc8cc15c5caaac9eb8e3bf8dba8cfaf5e39e9a0ab0c859a1594ecfccca1d14
// https://${hostWithoutProtocol}/products?host=${host}&shop=${shop}&hmac=${hmac}
// 3bfc8cc15c5caaac9eb8e3bf8dba8cfaf5e39e9a0ab0c859a1594ecfccca1d14