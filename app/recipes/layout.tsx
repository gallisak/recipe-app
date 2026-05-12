import Header from "@/components/Header";
import Sidebar from "../../components/SideBar";
import { FilterProvider } from "@/contexts/FilterContext";

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
    return (
        <FilterProvider>
            <div className="min-h-screen bg-[#262220]">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        {children}
                    </main>
                </div>
            </div>
        </FilterProvider>
    );
}