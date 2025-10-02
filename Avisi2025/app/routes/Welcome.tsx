import type { Route } from "./+types/Welcome";
import { Welcome } from "../src/components/Welcome";
import { Receivers } from "../src/components/DB-Receivers";
import { Gifters } from "../src/components/DB-Gifters";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Avisi Hackthon 2025" },
    { name: "description", content: "Avisi 2025" },
  ];
}

export default function Home() {
  return <Welcome />;
}
