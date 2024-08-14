import Appbar from "@/components/custom-components/navbar";
import WelcomeScreen from "@/components/custom-components/welcome-screen";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import PlaylistsWall from "./PlaylistsWall";

export default async function PostLogin() {
  return (
    <BackgroundGradientAnimation overlayOpacity={1} interactive={false}>
      <WelcomeScreen />
      <Appbar />
      <PlaylistsWall />
    </BackgroundGradientAnimation>
  );
}
