import Appbar from "@/components/custom-components/navbar";
import WelcomeScreen from "@/components/custom-components/welcome-screen";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import PlaylistsWall from "./PlaylistsWall";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth/auth";

export default async function PostLogin() {
  const session = await getServerSession(NEXT_AUTH);
  return (
    <BackgroundGradientAnimation overlayOpacity={1} interactive={false}>
      <WelcomeScreen />
      <Appbar />
      <PlaylistsWall session={session} />
    </BackgroundGradientAnimation>
  );
}
