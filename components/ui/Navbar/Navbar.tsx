import Link from 'next/link';
import { createServerSupabaseClient } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';
import s from './Navbar.module.css';
import ThemeChanger from '@/components/DarkSwitch';

export default async function Navbar() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className={s.root}>
  
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-[2560px] px-6 flex flex-col text-left w-full">
        <div className="mt-1 flex justify-between flex items-center">
          <div className="flex items-center justify-center justify-start">
          <Link href="/" className={`${s.logo}  `} aria-label="Logo">
              <Logo />
              </Link>
            {/* Add the vertical grey bar */}
            <div className="border-l border-gray-400 h-8 mx-4"></div>
            <Link href="/order" className={s.link}>
                Pricing
              </Link>
              <Link href="/download" className={s.link}>
                Download
              </Link>
              
                <p className="text-3xl ml-4 font-extrabold text-zinc-800 dark:text-white sm:text-left text-left"></p>
          </div>


          <div className="flex items-center ">
            <nav className={`ml-auto ${s.link}`}>
            <Link
                href="/order"
                className="px-4 py-2 border mr-4 border-2 font-medium text-center bg-black dark:bg-white dark:text-black rounded-full sm:text-white transition duration-500 ease-in-out transform hover:scale-110"
              >
                Get UnblockVPN
              </Link>

              <Link href="/support" className={s.link}>
                Support
              </Link>

            </nav>

            {user ? (
          <>
            <SignOutButton />
            <Link href="/account" className={`${s.link} whitespace-nowrap`}>
              Account
            </Link>
          </>
        ) : (
          <Link href="/signin" className={`${s.link} mr-2 whitespace-nowrap`}>
            Log in
          </Link>
        )}
            {/* Conditionally render ThemeChanger based on screen size */}
            <div className="hidden sm:block">
              <ThemeChanger />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
