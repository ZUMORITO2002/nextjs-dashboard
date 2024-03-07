
import { ArrowRightIcon, CubeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from './ui/fonts';
import Image from 'next/image';


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
    <div
      className={`${lusitana.className} flex flex-row font-bold items-center leading-none text-gray-800`}
    >
      <CubeIcon className="h-24 w-24 rotate-[45deg]" />
      <p className="text-[81px]">KONDOTH FABRICATORS</p>
    </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg  px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl  text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Kondoth.</strong>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-69 md:py-45">
          {/* Add Hero Images Here */}
          <Image
        src="/fab.jpg"
        width={1500}
        height={900}
        className="hidden md:block"
        alt="Screenshots of the fabrication "
      />
        </div>
      </div>
    </main>
  );
}
