import { useEffect, useMemo, useState } from "react";
import supabase from "./supabase-client";
import {
    Chart,
    type AxisOptions,
    type ChartOptions,
} from "react-charts";

type DealRow = {
    name: string;
    value: number;
};

type Metric = {
    name: string;
    sum: number;
};

type ChartDatum = {
    primary: string;
    secondary: number;
};
const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    useEffect(() => {
        const fetchMetrics = async () => {
            const { data, error } = await supabase
                .from("sales_deals")
                .select("name, value");

            if (error) {
                console.error(error);
                return;
            }
            const rows = (data ?? []) as DealRow[];
            const totals = rows.reduce<Record<string, number>>((acc, row) => {
                acc[row.name] = (acc[row.name] ?? 0) + row.value;
                return acc;
            }, {});
            const result: Metric[] = Object.entries(totals).map(
                ([name, sum]) => ({ name, sum })
            );
            setMetrics(result);
        };
        fetchMetrics();
        const channel = supabase.channel('deal-changes').on('postgres_changes', {
            event: "*",
            schema: "public",
            table: "sales_deals",
        }, (payload) => {
            console.log({ payload });
            fetchMetrics()
        })
        .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, []);

    const yMax = useMemo(() => {
        if (!metrics.length) return 0;
        return Math.max(...metrics.map(m => m.sum)) + 200;
    }, [metrics]);
    const data = useMemo(
        () => [
            {
                label: "Sales",
                data: metrics.map<ChartDatum>((m) => ({
                    primary: m.name,
                    secondary: m.sum,
                })),
            },
        ],
        [metrics]
    );
    const primaryAxis = useMemo<AxisOptions<ChartDatum>>(
        () => ({
            getValue: (datum) => datum.primary,
            scaleType: "band",
            position: "bottom",
        }),
        []
    );
    const secondaryAxes = useMemo<AxisOptions<ChartDatum>[]>(
        () => [
            {
                getValue: (datum) => datum.secondary,
                scaleType: "linear",
                min: 0,
                max: yMax,
            },
        ],
        [yMax]
    );
    const options = useMemo<ChartOptions<ChartDatum>>(
        () => ({
            data,
            primaryAxis,
            secondaryAxes,
            defaultColors: ["#58d675"],
            tickLabelStyle: {
                fill: "#ffffff",
                fontSize: 12,
            },
            tooltip: false,
        }),
        [data, primaryAxis, secondaryAxes]
    );
    return (
        <div className="dashboard-wrapper">
            <div className="chart-container">
                <h2>Total Sales This Quarter ($)</h2>

                <div style={{ height: 400 }}>
                    <Chart options={options} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
