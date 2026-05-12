"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

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

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);

            const fullName = user.displayName || "Google User";
            const nameParts = fullName.split(" ");
            const fName = nameParts[0] || "Google";
            const lName = nameParts.slice(1).join(" ") || "User";

            // Виправлено: setDoc (латиницею) + додано merge: true
            await setDoc(userRef, {
                firstName: fName,
                lastName: lName,
                email: user.email,
                lastLogin: serverTimestamp(),
            }, { merge: true });

            router.push("/recipes");
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Помилка при вході через Google");
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex">
                <Image
                    src={logo}
                    alt="Recipe App Logo"
                    width={40} // Додай розміри, якщо Image свариться
                    height={40}
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
                        className="w-full mt-2 border border-[#6D6665] bg-transparent p-3 rounded-xl placeholder:text-[#8A8F93] text-white outline-none focus:border-[#FFE478]"
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                </div>

                <div>
                    <label htmlFor="password" className="text-sm text-white">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Password"
                        className="w-full mt-2 border border-[#6D6665] bg-transparent p-3 rounded-xl placeholder:text-[#8A8F93] text-white outline-none focus:border-[#FFE478]"
                    />
                    {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                </div>

                <div className="flex justify-end">
                    <Link href="#" className="text-[#FFE478] font-medium text-sm">Forgot password?</Link>
                </div>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-[#FFE478] cursor-pointer text-black p-3 rounded-2xl hover:bg-[#FFE435] transition disabled:opacity-50 mt-2 font-bold"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="flex items-center gap-4">
                <hr className="flex-1 border-[#635B57]" />
                <span className="text-[#FFFFFF99] text-sm">or continue with</span>
                <hr className="flex-1 border-[#635B57]" />
            </div>

            {/* Виправлено: onClick викликає handleGoogleLogin */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border cursor-pointer border-[#6D6665] text-[#FFFFFF99] p-3 rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-900 transition"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
            </button>

            <p className="text-center text-white">
                Don't have an account yet? <Link href="/auth/signup" className="text-[#FFE478] hover:underline">Sign up</Link>
            </p>
        </div>
    );
}