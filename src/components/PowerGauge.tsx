import React from 'react';
import { Zap, Gauge, Battery } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';

// FusionCharts imports
import FusionCharts from 'fusioncharts';
import ReactFusioncharts from 'react-fusioncharts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.candy';


interface FusionChartProps {
  type: string;
  width: string | number;
  height: string | number;
  dataFormat: 'json' | 'xml';
  dataSource: object;
}


// Register the modules with FusionCharts
ReactFusioncharts.fcRoot(FusionCharts, Widgets, FusionTheme);

const FusionChartWrapper: React.FC<FusionChartProps> = (props) => {
  const ChartComponent = ReactFusioncharts as unknown as React.FC<FusionChartProps>;
  return <ChartComponent {...props} />;
};

export const PowerGauge: React.FC = () => {
  const { power, rpm, powerFactor, batteryVoltage } = useAppSelector((state) => state.generator);

  const maxPower = 100;
  const powerPercentage = Math.min((power / maxPower) * 100, 100);

  const dataSource = {
    chart: {
      captionpadding: "0",
      origw: "320",
      origh: "300",
      gaugeouterradius: "115",
      gaugestartangle: "270",
      gaugeendangle: "-25",
      showvalue: "1",
      valuefontsize: "30",
      majortmnumber: "10",
      majortmthickness: "2",
      majortmheight: "13",
      minortmheight: "7",
      minortmthickness: "1",
      minortmnumber: "1",
      showgaugeborder: "0",
      theme: "candy",
      lowerlimit: "0",
      upperlimit: maxPower.toString(),
      numberSuffix: " kW",
    },
    colorrange: {
      color: [
        { minvalue: "0", maxvalue: (maxPower * 0.5).toString(), code: "#22c55e" },
        { minvalue: (maxPower * 0.5).toString(), maxvalue: (maxPower * 0.8).toString(), code: "#eab308" },
        { minvalue: (maxPower * 0.8).toString(), maxvalue: maxPower.toString(), code: "#ef4444" }
      ]
    },
    dials: {
      dial: [
        {
          value: power.toString(),
          bgcolor: "#F20F2F",
          basewidth: "8"
        }
      ]
    },
    annotations: {
      groups: [
        {
          items: [
          ]
        }
      ]
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Power Output</h2>
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>

      {/* FusionChart Gauge */}
      <div className="text-center mb-4">
        <div className="w-full max-w-sm mx-auto">
          <FusionChartWrapper
            type="angulargauge"
            width="100%"
            height="250"
            dataFormat="json"
            dataSource={dataSource}
          />
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {powerPercentage.toFixed(0)}% of capacity
        </div>
      </div>

      {/* Compact Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <Gauge className="w-4 h-4 text-slate-600 dark:text-slate-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(rpm)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">RPM</div>
        </div>

        <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{powerFactor}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">PF</div>
        </div>

        <div className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <Battery className="w-4 h-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-green-600 dark:text-green-400">{batteryVoltage.toFixed(1)}V</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Battery</div>
        </div>
      </div>
    </div>
  );
};
