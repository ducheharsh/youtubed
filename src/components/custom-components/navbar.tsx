"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import GoogleBtn from "./google-btn";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const session = useSession();
  const router = useRouter();
  console.log(session);
  return (
    <nav className=" border-b-2 border-gray-200/20">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://cdn.hashnode.com/res/hashnode/image/upload/v1719466107244/fad13963-ba76-47f1-af51-200e1c0fca9d.png"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-poppins font-semibold whitespace-nowrap text-white">
            Youtubed
          </span>
        </a>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {session?.data ? (
            <div className="flex">
              <img
                className="rounded-full w-10"
                aria-expanded={isDropdownOpen ? "true" : "false"}
                onClick={toggleDropdown}
                src={session.data.user?.image || ""}
                width={30}
              />
              <span className="sr-only"></span>

              <div
                className={`${
                  isDropdownOpen ? "block" : "hidden"
                } z-50 absolute top-12 my-4 right-24 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow `}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 ">
                    {session.data.user?.name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {session.data.user?.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                      onClick={() => {
                        router.push("/postlogin");
                      }}
                    >
                      My Playlists
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        signOut({ callbackUrl: "/", redirect: true });
                      }}
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 "
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <GoogleBtn onClick={signIn} />
          )}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        ></div>
      </div>
    </nav>
  );
}
