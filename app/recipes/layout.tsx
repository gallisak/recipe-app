import Header from "../../components/Header";
import Sidebar from "../../components/SideBar";

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#2D2726]">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}