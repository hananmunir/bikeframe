import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const DynamicScene = dynamic(() => import("@/components/model"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <DynamicScene />;
}
