import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  // Keuze scherm
  route("Choice", "routes/Choice.tsx"),

  
  // Doneren routes
  route("doneren/dashboard/overzicht", "routes/donate/Dashboard.tsx"),

  // Ontvangen routes
  route("ontvangen/dashboard/overzicht", "routes/receive/Dashboard.tsx"),
  route("ontvangen/dashboard/matches", "routes/receive/Matches.tsx"),
  route("ontvangen/dashboard/transacties", "routes/receive/Transactions.tsx"),

  route("/dashboard/community", "routes/community.tsx"),
] satisfies RouteConfig;
