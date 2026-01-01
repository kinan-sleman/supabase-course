import { useEffect } from "react";
import supabase from "./supabase-client";

const Dashboard: React.FC = () => {
    useEffect(() => {
        const fetchMetrics = async () => {
            const { data, error } = await supabase
                .from("sales_deals")
                .select(`name, value.sum()`)

            if (error) {
                console.error(error);
            } else {
                console.log("Top Sales Rep:", data);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="chart-container">
                <h2>Total Sales This Quarter ($)</h2>
            </div>
        </div>
    );
};

export default Dashboard;
