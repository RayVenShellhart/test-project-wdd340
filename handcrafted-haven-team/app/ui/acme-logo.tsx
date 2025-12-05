import { HeartIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
  className={`${lusitana.className} flex flex-row items-center leading-none text-white gap-x-3`}
>
  <HeartIcon className="h-12 w-12 rotate-[15deg]" />
  <p className="text-[22px]">Handcrafted Haven</p>
</div>
  );
}
