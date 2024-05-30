import { AreaChart, Card, Metric, TabList, Tab, TabGroup, TabPanels, TabPanel } from "@tremor/react";

const numberFormatter = (value: number) => Intl.NumberFormat("us").format(value).toString();

function sumArray<T extends ChartData>(array: LineChartData<T>[], metric: keyof ChartData) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue[metric], 0);
}

export type ChartData = Record<string, number>;

function averageArray<T extends ChartData>(array: LineChartData<T>[], metric: keyof ChartData) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue[metric], 0) / array.length;
}

function prettyMetric(metric: string) {
  return metric
    .toString()
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export type LineChartData<T extends ChartData> = {
  date: string;
} & T;

export interface LineChartProps<T extends ChartData> {
  data: LineChartData<T>[];
  // type of string array as all strings from T
  metrics: {
    name: keyof ChartData;
    sum: boolean;
    unit: string;
  }[];
}

export default function LineChart<T extends ChartData>({ data, metrics }: LineChartProps<T>) {
  return (
    <Card className="p-0">
      <TabGroup>
        <TabList>
          {...metrics.map((metric, i) => (
            <Tab key={i} className="p-4 text-left sm:p-6">
              <p className="text-sm sm:text-base">{prettyMetric(metric.name)}</p>
              <Metric className="mt-2 text-inherit">
                {numberFormatter(metric.sum ? sumArray(data, metric.name) : averageArray(data, metric.name))}
                {metric.unit}
              </Metric>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {...metrics.map((metric, i) => (
            <TabPanel key={i} className="p-6">
              <AreaChart
                className="mt-10 h-80"
                data={data}
                index={"date"}
                categories={[metric.name]}
                colors={["blue"]}
                valueFormatter={(v) => numberFormatter(v) + metric.unit}
                showLegend={false}
                yAxisWidth={50}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
