/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import baptlabsLogo from "../../public/external_media/baptlabs.png";
import mauLogo from "../../public/external_media/mau_logo.jpg";
import aptosLogo from "../../public/external_media/aptos-transparent.png";
import BadgeButtonGroup, {
  Badge,
} from "./inputs/buttons/badges/BadgeButtonGroup";
import { TokenType, TOKEN_LIST } from "@/util/tokenList";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type PriceChartProps = {
  inputToken: TokenType;
  outputToken: TokenType;
};

const PriceChart: React.FC<PriceChartProps> = ({ inputToken, outputToken }) => {
  const [series, setSeries] = useState<any>([]);
  const [options, setOptions] = useState<any>({});
  const [priceData, setPriceData] = useState<any>([]);
  const [hourlyPriceData, setHourlyPriceData] = useState<any>([]);
  const [baptData, setBaptData] = useState<any>(undefined);
  const [changeBapt, setChangeBapt] = useState<any>(undefined);
  const [priceDifference, setPriceDifference] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<string>("bapt_price");
  const [interval, setInterval] = useState<"day" | "week" | "month" | "all">(
    "day"
  );

  useEffect(() => {
    if (!inputToken || !outputToken) return;

    if (outputToken == TOKEN_LIST[0] || inputToken == TOKEN_LIST[0]) {
      setSelectedToken("bapt_price");
    } else if (outputToken == TOKEN_LIST[2] || inputToken == TOKEN_LIST[2]) {
      setSelectedToken("apt_usdc_price");
    }
  }, [inputToken, outputToken]);

  useEffect(() => {
    fetch("https://api.kreitzn.dev/bapt/historical/day")
      .then((res) => res.json())
      .then((res) => {
        setPriceData(res);
      }).catch(e => console.log(e));

    fetch("https://api.kreitzn.dev/bapt/historical/hour")
      .then((res) => res.json())
      .then((res) => {
        setHourlyPriceData(res);
      }).catch(e => console.log(e));


    fetch("https://api.kreitzn.dev/bapt")
      .then((res) => res.json())
      .then((res) => {
        setBaptData(res[0]);
      }).catch(e => console.log(e));


    fetch("https://api.kreitzn.dev/bapt/change/day")
      .then((res) => res.json())
      .then((res) => {
        setChangeBapt(res[0]);
      }).catch(e => console.log(e));

  }, []);

  useEffect(() => {
    if (!priceData || !hourlyPriceData) return;

    if (interval == "day") {
      const latest = priceData[priceData.length - 1];
      const oldest = priceData[0];

      latest &&
        oldest &&
        setPriceDifference(
          ((Number(latest[selectedToken]) - Number(oldest[selectedToken])) /
            Number(latest[selectedToken])) *
            100
        );
    } else {
      let latest = undefined;
      let oldest = undefined;

      const oneWeekAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      ).getTime();

      const oneMonthAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).getTime();

      hourlyPriceData.map((row: any) => {
        if (row[selectedToken]) {
          switch (interval) {
            case "all":
              latest = row;
              oldest = oldest ?? row;
              break;
            case "month":
              if (
                new Date(
                  Number(Number(row["timestamp"]).toFixed(0))
                ).getTime() *
                  1000 >=
                oneMonthAgo
              ) {
                latest = row;
                oldest = oldest ?? row;
              }
              break;
            case "week":
              if (
                new Date(
                  Number(Number(row["timestamp"]).toFixed(0))
                ).getTime() *
                  1000 >=
                oneWeekAgo
              ) {
                latest = row;
                oldest = oldest ?? row;
              }
              break;
          }
        }
      });

      latest &&
        oldest &&
        setPriceDifference(
          ((Number(latest[selectedToken]) - Number(oldest[selectedToken])) /
            Number(latest[selectedToken])) *
            100
        );
    }
  }, [priceData, hourlyPriceData, selectedToken, interval]);

  useEffect(() => {
    let data: any[] = [];

    let now = 0;
    let fiveFromNow = 0;

    let min = 0;
    let max = 0;

    if (interval == "day") {
      priceData.map((row: any) => {
        if (
          new Date(Number(Number(row["timestamp"]).toFixed(0))).getTime() *
            1000 >
            fiveFromNow &&
          row[selectedToken]
        ) {
          data.push([
            new Date(Number(Number(row["timestamp"]).toFixed(0))).getTime() *
              1000,
            row[selectedToken],
          ]);

          if (row[selectedToken] < min || min == 0) {
            min = row[selectedToken];
          }

          if (row[selectedToken] > max || max == 0) {
            max = row[selectedToken];
          }

          fiveFromNow =
            new Date(Number(Number(row["timestamp"]).toFixed(0))).getTime() *
              1000 +
            300000;
        }
      });
    } else {
      hourlyPriceData.map((row: any) => {
        if (row[selectedToken]) {
          switch (interval) {
            case "all":
              data.push([
                new Date(
                  Number(Number(row["timestamp"]).toFixed(0))
                ).getTime() * 1000,
                row[selectedToken],
              ]);

              if (row[selectedToken] < min || min == 0) {
                min = row[selectedToken];
              }

              if (row[selectedToken] > max || max == 0) {
                max = row[selectedToken];
              }

              break;
            case "week":
              const oneWeekAgo = new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000
              ).getTime();

              if (
                new Date(
                  Number(Number(row["timestamp"]).toFixed(0))
                ).getTime() *
                  1000 >=
                oneWeekAgo
              ) {
                data.push([
                  new Date(
                    Number(Number(row["timestamp"]).toFixed(0))
                  ).getTime() * 1000,
                  row[selectedToken],
                ]);

                if (row[selectedToken] < min || min == 0) {
                  min = row[selectedToken];
                }

                if (row[selectedToken] > max || max == 0) {
                  max = row[selectedToken];
                }
              }

              break;
            case "month":
              const oneMonthAgo = new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ).getTime();

              if (
                new Date(
                  Number(Number(row["timestamp"]).toFixed(0))
                ).getTime() *
                  1000 >=
                oneMonthAgo
              ) {
                data.push([
                  new Date(
                    Number(Number(row["timestamp"]).toFixed(0))
                  ).getTime() * 1000,
                  row[selectedToken],
                ]);

                if (row[selectedToken] < min || min == 0) {
                  min = row[selectedToken];
                }

                if (row[selectedToken] > max || max == 0) {
                  max = row[selectedToken];
                }
              }

              break;
          }
        }
      });
    }

    setSeries([
      {
        name: "Price (USD)",
        data: data,
      },
    ]);

    setOptions({
      chart: {
        type: "area",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        foreColor: "#2dd8a7",
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      tooltip: {
        x: {
          formatter: function (value: any, timestamp: any) {
            const d = new Date(value);

            return (
              ("0" + d.getDate()).slice(-2) +
              "-" +
              ("0" + (d.getMonth() + 1)).slice(-2) +
              " " +
              ("0" + d.getHours()).slice(-2) +
              ":" +
              ("0" + d.getMinutes()).slice(-2)
            ); // The formatter function overrides format property
          },
        },
        theme: "dark",
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
        },
      },
      colors: ["#2dd8a7"],
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.45,
          opacityTo: 0.0,
        },
      },
      yaxis: {
        tickAmount: 5,
        decimalsInFloat: 6,
        min: min / 1.05,
        max: max * 1.05,
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function (value: any, timestamp: any) {
            const d = new Date(timestamp);

            return (
              ("0" + d.getHours()).slice(-2) +
              ":" +
              ("0" + d.getMinutes()).slice(-2)
            ); // The formatter function overrides format property
          },
        },
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        show: false, // you can either change hear to disable all grids
        xaxis: {
          lines: {
            show: true, //or just here to disable only x axis grids
          },
        },
        yaxis: {
          lines: {
            show: true, //or just here to disable only y axis
          },
        },
      },
    });
  }, [hourlyPriceData, priceData, selectedToken, interval]);

  return (
    <div>
      <div className="flex flex-row justify-between flex-wrap">
        <div className="flex flex-row">
          <div className="ml-4">
            <img
              src={
                selectedToken == "bapt_price"
                  ? baptlabsLogo.src
                  : selectedToken == "mau_price"
                  ? mauLogo.src
                  : aptosLogo.src
              }
              className="w-12 h-12 rounded-full"
              alt="BaptLabs"
            />
          </div>
          <div className="px-2">
            <div className="font-semibold text-lg">
              {selectedToken == "bapt_price" ? (
                <div>
                  {TOKEN_LIST[0].name} ({TOKEN_LIST[0].symbol})
                </div>
              ) : (
                <div>
                  {TOKEN_LIST[1].name} ({TOKEN_LIST[1].symbol})
                </div>
              )}
            </div>
            <div className="">
              ${baptData ? Number(baptData[selectedToken]).toFixed(8) : "--"}{" "}
              <span
                className={`${
                  priceDifference > 0 ? "text-green-500" : "text-red-500"
                } text-sm`}
              >
                ({priceDifference > 0 && <span>+</span>}
                {priceDifference.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row h-6 my-2 ml-4 md:w-fit w-full">
          <BadgeButtonGroup>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setInterval("all");
              }}
            >
              <Badge label="All" isSelected={interval == "all"} />
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setInterval("month");
              }}
            >
              <Badge label="1mo" isSelected={interval == "month"} />
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setInterval("week");
              }}
            >
              <Badge label="7d" isSelected={interval == "week"} />
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setInterval("day");
              }}
            >
              <Badge label="24hr" isSelected={interval == "day"} />
            </div>
          </BadgeButtonGroup>
        </div>
      </div>
      <Chart
        options={options}
        series={series}
        width={"100%"}
        type={"area"}
        height={400}
      />
    </div>
  );
};

export default PriceChart;
