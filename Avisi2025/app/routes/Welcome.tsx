import type { Route } from "./+types/Welcome";
import { Receivers } from "./DB-Receivers";
import { Gifters } from "./DB-Gifters";
import { ChoiceRG } from "./ChoiceRG";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Avisi Hackthon 2025" },
    { name: "description", content: "Avisi 2025" },
  ];
}


export default function Home() {
  return <div>Testtest</div>;
}
