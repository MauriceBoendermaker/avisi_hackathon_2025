import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Welcome.tsx"),
  route("ChoiceRG", "src/components/ChoiceRG.tsx"),
] satisfies RouteConfig;
