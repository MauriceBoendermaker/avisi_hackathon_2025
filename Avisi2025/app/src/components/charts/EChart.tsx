import React, { useEffect, useState } from "react";

type Props = {
    option: any;
    style?: React.CSSProperties;
};

let EChartsReactComponent: React.ComponentType<any> | null = null;

const EChart: React.FC<Props> = ({ option, style }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (typeof window === "undefined") return;
            if (!EChartsReactComponent) {
                const mod: any = await import("echarts-for-react");
                EChartsReactComponent = mod.default || mod;
            }
            if (mounted) setReady(true);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (!ready || !EChartsReactComponent) return null;
    const Comp = EChartsReactComponent;
    return <Comp option={option} style={style} />;
};

export default EChart;
