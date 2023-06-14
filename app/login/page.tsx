"use client"
import useAuthStore from "@/features/auth";
import { auth } from "@/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
    const currentUser = useAuthStore((state) => state.currentUser)
    const router = useRouter()


    const adminLogin = async (event: any) => {
        event.preventDefault()


        await signInWithEmailAndPassword(auth, email, password).then(response => {
            alert("Login successful")
            router.push("/")
        }).catch((err) => {
            console.log(err);
        });

    };
    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <form className='max-w-md w-full rounded-md shadow-xl p-3 bg-white' onSubmit={adminLogin}>
                <h1 className='text-2xl text-black font-bold font-mono'>Admin Login</h1>

                <div className="flex flex-col gap-1 w-full ">
                    <label className="pt-3" htmlFor="">Email</label>
                    <input type="text" name="email" className="px-3 py-1 focus:outline-black border-2" placeholder='Enter email...' onChange={(e) => setEmail(e.target.value)} />

                    <label className="pt-3" htmlFor="">Password</label>
                    <input type="password" name="password" className="px-3 py-1 focus:outline-black border-2" placeholder='Enter password...' onChange={(e) => setPassword(e.target.value)} />

                    <button className="bg-blue-600 text-white py-2 block my-2" type="submit">LOGIN</button>
                    <Link href="/" className="hover:text-blue-600 block">Go back to home</Link>
                </div>

            </form>
        </div>
    )
}


const adminLogin = async () => {


}