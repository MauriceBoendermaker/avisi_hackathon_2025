import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("receiver", "routes/DB-Receivers.tsx"),
  route("gifter", "routes/DB-Gifters.tsx"),
  route("choicerg", "routes/ChoiceRG.tsx"),
  
  // Doneren routes
  route("doneren/dashboard/overzicht", "routes/donate/Dashboard.tsx"),

  // Ontvangen routes
  route("ontvangen/dashboard/overzicht", "routes/receive/Dashboard.tsx"),
  route("ontvangen/dashboard/matches", "routes/receive/Matches.tsx"),
  route("ontvangen/dashboard/transacties", "routes/receive/Transactions.tsx"),

  route("/dashboard/community", "routes/community.tsx"),
] satisfies RouteConfig;
