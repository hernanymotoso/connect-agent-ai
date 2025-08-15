import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    //TODO: put some logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedRoutes = ["/dashboard"];
        const isProtectedRoute = protectedRoutes.some((route) =>
          req.nextUrl.pathname.startsWith(route)
        );

        if (isProtectedRoute && !token) {
          console.log("Acesso negado - sem token");
          return false;
        }
        console.log("Acesso permitido");
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
