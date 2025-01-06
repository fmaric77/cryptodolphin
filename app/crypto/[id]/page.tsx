import CryptoChartContainer from "../../components/CryptoChartContainer";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CryptoChartContainer params={params} />;
}