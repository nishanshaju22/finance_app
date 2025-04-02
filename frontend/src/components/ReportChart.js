import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ReportChart = ({ chartData, chartType = "bar" }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstanceRef.current = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        return () => {
            chartInstanceRef.current.destroy();
        };
    }, [chartData, chartType]);

    return <canvas ref={chartRef} />;
};

export default ReportChart;
