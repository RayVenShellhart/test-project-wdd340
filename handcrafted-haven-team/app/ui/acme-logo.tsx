import { HeartIcon } from '@heroicons/react/24/outline';
import { pacifico } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
  className={`${pacifico.className} flex flex-row items-center leading-none text-[#333333] gap-x-3`}
>
  <HeartIcon className="h-12 w-12 rotate-[15deg]" />
  <p className="text-[22px]">Handcrafted Haven</p>
</div>
  );
}
