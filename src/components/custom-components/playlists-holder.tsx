"use client";

export default function PlaylistsHolder({
  thumbnail,
  title,
  channel,
  onClick,
}: {
  thumbnail?: string;
  title: string;
  channel: string;
  onClick?: () => void;
}) {
  return (
    <li
      className="m-6 flex flex-col justify-between overflow-visible max-h-64 mt-5 group shadow-2xl"
      onClick={onClick}
    >
      <div
        onClick={onClick}
        className="absolute  text-white uppercase pl-4 pt-3 font-semibold rounded-2xl w-[290px] z-50 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 h-[70px] overflow-hidden mt-[4.36rem] bg-transparent group-hover:translate-y-[1rem]"
      >
        {title}
        <div className="text-sm font-normal lowercase">{channel}</div>
      </div>
      <div
        className="z-40 rounded-xl hover:translate-y-[1rem] overflow-visible transition-transform duration-300 shadow-2xl object-cover w-[290px] h-[160px] bg-no-repeat bg-center bg-cover group-hover:opacity-90 group-hover:brightness-50"
        style={{ backgroundImage: `url(${thumbnail})` }}
      ></div>
    </li>
  );
}
