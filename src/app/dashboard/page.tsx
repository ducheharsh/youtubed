import dynamic from "next/dynamic";
import Appbar from "@/components/custom-components/navbar";

const ClientSideComponent = dynamic(() => import("./ClienSideComponent"), {
  ssr: false,
});

export default async function MainPage() {
  return (
    <div className="text-white">
      <Appbar />
      <ClientSideComponent />
    </div>
  );
}
