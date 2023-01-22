import { ResponsiveLine, Serie } from "@nivo/line";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";

interface ChartProps {
  data: Serie[];
}

export const Chart = ({ data }: ChartProps) => {
  const { width } = useWindowDimensions();
  const ticks = width ? Math.floor(width / 140) : 10;

  return (
    <ResponsiveLine
      margin={{ top: 50, right: 50, bottom: 70, left: 80 }}
      data={data}
      theme={{
        textColor: "#fff",
        fontSize: 14,
      }}
      xScale={{
        format: "%Y-%m-%dT%H:%M:%S.%LZ",
        type: "time",
      }}
      axisBottom={{
        format: "%d.%m. %H:%M",
        legend: "Datum a čas",
        legendOffset: 40,
        legendPosition: "middle",
        tickValues: ticks,
      }}
      axisLeft={{
        format: ".0%",
        legend: "Pravděpodobnost vítězství",
        legendOffset: -50,
        legendPosition: "middle",
      }}
      yScale={{
        type: "linear",
        min: 0,
        max: 1,
        stacked: false,
      }}
      xFormat="time:%d.%m.%Y %H:%M"
      yFormat=".0%"
      lineWidth={8}
      enablePoints={false}
      sliceTooltip={({ slice }) => (
        <div
          style={{
            background: "white",
            padding: "0.875rem",
            border: "1px solid #ccc",
          }}
        >
          <div
            style={{
              textAlign: "center",
              borderBottom: "1px solid #ccc",
              paddingBottom: "0.275rem",
              marginBottom: "0.375rem",
            }}
          >
            {slice.points[0].data.xFormatted}
          </div>

          {slice.points.map((point) => (
            <div
              key={point.serieId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                color: point.serieColor,
                padding: "3px 0",
              }}
            >
              <strong>{point.serieId}</strong>{" "}
              {point.data.y.toLocaleString("cs-CZ", {
                maximumFractionDigits: 1,
                style: "percent",
              })}
            </div>
          ))}
        </div>
      )}
      enableSlices="x"
      colors={{ scheme: "set2" }}
      legends={[
        {
          anchor: "top",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -30,
          itemsSpacing: 30,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.85,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};
