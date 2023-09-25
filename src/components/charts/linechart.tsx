import {
  AreaChart,
  Card,
  Metric,
  TabList,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from "@tremor/react";

const data = [
  {
    Month: "Jan 22",
    Visitors: 289,
    "Page Views": 1012,
    "Bounce Rate": 0.5,
  },
  //...
  {
    Month: "Jan 23",
    Visitors: 389,
    "Page Views": 1232,
    "Bounce Rate": 0.51,
  },
];

const numberFormatter = (value: number) =>
  Intl.NumberFormat("us").format(value).toString();
const percentageFormatter = (value: number) =>
  `${Intl.NumberFormat("us")
    .format(value * 100)
    .toString()}%`;
function sumArray(array: any[], metric: string) {
  return array.reduce(
    (accumulator, currentValue) => accumulator + currentValue[metric],
    0,
  );
}

export type LineChartData<T extends Record<string, number>> = {
  date: string;
} & T;

export interface LineChartProps<T extends Record<string, number>> {
  data: LineChartData<T>[];
  // type of string array as all strings from T
  metrics: (keyof T)[];
}

export default function LineChart<T extends Record<string, number>>({
  data,
  metrics,
}: LineChartProps<T>) {
  return (
    <Card className="p-0">
      <TabGroup>
        <TabList>
          {...metrics.map((metric, i) => (
            <Tab key={i} className="p-4 sm:p-6 text-left">
              <p className="text-sm sm:text-base">
                {metric.toString().replaceAll("_", " ").split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")
                }
              </p>
              <Metric className="mt-2 text-inherit">
                {sumArray(data, metric as string)}
              </Metric>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {...metrics.map((metric, i) => (
            <TabPanel key={i} className="p-6">
              <AreaChart
                className="h-80 mt-10"
                data={data}
                index={"date"}
                categories={[metric as string]}
                colors={["blue"]}
                valueFormatter={numberFormatter}
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
