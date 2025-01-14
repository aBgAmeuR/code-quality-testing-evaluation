import { redirect } from "next/navigation";

export const metadata = {
  title: "Store | Kitchen Sink"
};

export default function PageHome() {
  return redirect("/products");
}
