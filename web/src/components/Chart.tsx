import { ResponsiveLine, type Point, type SliceTooltipProps } from "@nivo/line";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { ChartData } from "@/pages";

interface ChartProps {
  data: ChartData;
}

export const Chart = ({ data }: ChartProps) => {
  const { width } = useWindowDimensions();
  const ticks = width ? Math.floor(width / 140) : 10;

  return (
    <ResponsiveLine
      margin={{ top: 50, right: 15, bottom: 70, left: 70 }}
      data={data || []}
      theme={{
        textColor: "#fff",
        fontSize: 14,
        crosshair: {
          line: {
            stroke: "#fff",
            strokeWidth: 3,
          },
        },
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
      lineWidth={6}
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
              color: "#000",
              fontWeight: 600,
            }}
          >
            {slice.points[0].data.xFormatted}
          </div>

          {slice.points.map((point) => (
            <div
              key={point.serieId}
              style={{
                display: "flex",
                flexDirection: "column",
                color: point.serieColor,
                padding: "0.25rem 0",
              }}
            >
              <strong>{point.serieId}</strong>
              <span>
                Pravděpodobnost:{" "}
                {point.data.y.toLocaleString("cs-CZ", {
                  maximumFractionDigits: 1,
                  style: "percent",
                })}
              </span>
              <span>
                Kurz:{" "}
                {/** TODO: Fix type!
              @ts-expect-error */}
                {point.data.odds.toLocaleString("cs-CZ", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      )}
      enableSlices="x"
      colors={{ scheme: "set2" }}
      legends={[
        {
          anchor: "top-right",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: -35,
          itemsSpacing: 30,
          itemDirection: "left-to-right",
          itemWidth: 100,
          itemHeight: 20,
          itemOpacity: 0.85,
          symbolSize: 12,
          symbolShape: "square",
        },
      ]}
    />
  );
};
