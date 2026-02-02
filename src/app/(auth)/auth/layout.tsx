import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side – add your image here (e.g. <Image src="/auth-cover.jpg" alt="" fill className="object-cover" />) */}
            <aside className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative  items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Replace this div with: <Image src="/your-image.jpg" alt="" fill className="object-cover" /> */}
                    <div className="w-full h-full min-h-[400px]  flex items-center justify-center">
                        {/* <span className="text-muted-foreground text-sm">
                            Add your image here
                        </span> */}
                        <Image src="/auth/auth_3.jpg" alt="" fill className="object-cover" />
                    </div>
                </div>
            </aside>

            {/* Right side – all auth forms (login, forgot-password, verify-email, reset-password) */}
            <main className="w-full lg:w-1/2 xl:w-[45%] flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 overflow-auto">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}

//bg-muted/30
// bg-muted/50