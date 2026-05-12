import Image from 'next/image';
import signinPhoto from '../../public/signinPhoto.png';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#2D2726] flex items-center justify-center">
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">{children}</div>
            </div>
            <div className="hidden md:block md:w-1/1.5 md:pr-8 h-[90vh] ">
                <Image
                    src={signinPhoto}
                    alt="Cooking"
                    className="w-full h-full rounded-3xl object-cover"
                    priority
                />
            </div>
        </div>
    );
}