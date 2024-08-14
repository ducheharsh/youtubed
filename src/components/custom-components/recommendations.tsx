export default function Reccomendations({
  thumbnail,
  title,
  channel,
}: {
  thumbnail: string;
  title: string;
  channel: string;
}) {
  return (
    <>
      <img
        src={thumbnail}
        className="z-40 my-4 rounded-lg min-w-[290px] min-h-[140px] "
      />
    </>
  );
}
