"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema)
    });

    const onSubmit = async (data: SignInForm) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            router.push("/recipes");
        } catch (error) {
            console.error(error);
            alert("Invalid email or password");
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            router.push("/recipes");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex">
                <Image
                    src={logo}
                    alt="Recipe App Logo"
                />
                <span className="text-2xl ml-1 text-[#FFE478]">RecipeFinder</span>
            </div>

            <div>
                <h1 className="text-2xl text-white font-bold mb-2">Welcome Back!</h1>
                <p className="text-[#6D6665]">We're thrilled to have you</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="text-sm text-white">Email address</label>
                    <input
                        {...register("email")}
                        placeholder="Email address"
                        className="w-full mt-4 border border-[#6D6665] p-3 rounded-xl placeholder:text-[#8A8F93] text-white outline-none focus:border-[#FFE478]"
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                </div>

                <div>
                    <label htmlFor="password" className="text-sm text-white">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Password"
                        className="w-full mt-4 border border-[#6D6665] p-3 rounded-xl placeholder:text-[#8A8F93] text-white outline-none focus:border-[#FFE478]"
                    />
                    {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                </div>

                <div className="flex justify-end">
                    <Link href="#" className="md:text-lg text-[#FFE478]  font-medium">Forgot password?</Link>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-[#FFE478] cursor-pointer text-black p-3 rounded-2xl hover:bg-[#FFE435] transition disabled:opacity-50 mt-2"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="flex items-center gap-4">
                <hr className="flex-1 border-[#635B57]" />
                <span className="text-[#FFFFFF99] text-sm">or continue with</span>
                <hr className="flex-1 border-[#635B57]" />
            </div>

            <button
                onClick={handleGoogle}
                className="w-full border cursor-pointer border-[#6D6665] text-[#FFFFFF99] p-3 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-900 transition"
            >
                Sign in with Google
            </button>

            <p className="text-center text-lg text-white">
                Don't have an account yet ? <span className="text-[#FFE478]"><Link href="/auth/signup">Sign up</Link></span>
            </p>
        </div>
    );
}