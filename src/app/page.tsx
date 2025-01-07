import { getTransactionsByMonth, sumTransactionsByMonth } from "@/backend/mongoDb/transactions";
import ResponsiveContainer from "@/components/Grid/ResponsiveContainer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { BarChart } from "@mui/x-charts/BarChart";

enum COLORS {
  RED = "#e81123",
  GREEN = "#004d40"
}

export const Home = async () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const nextMonth = currentMonth + 1;
  const currentMonthTotals = await getTransactionsByMonth(`${currentYear}-${currentMonth}`, `${currentYear}-${nextMonth}`);
  const transactions = await sumTransactionsByMonth();
  const getColors = transactions ? Object.values(transactions).map((item) => item.totalAmount > 0 ? COLORS.GREEN : COLORS.RED) : [];
  return (
    <>
      <ResponsiveContainer>
        <></>
        <Box>
          <Typography variant="h4">Monthly expenses</Typography>
          <BarChart
            dataset={transactions ?? []}
            xAxis={[{ scaleType: "band", dataKey: "_id", colorMap: { type: "ordinal", values: transactions ? Object.values(transactions).map((item) => item._id) : [], colors: getColors } }]}
            series={[
              { dataKey: "totalAmount" }
            ]}
            width={500}
            height={300}
          />
        </Box>
        <Box>
          <Typography variant="h4">Current month</Typography>          
          <BarChart
            dataset={currentMonthTotals ?? []}
            xAxis={[{ scaleType: "band", dataKey: "currMonth" }]}
            series={[{ dataKey: "totalExpenses" }, { dataKey: "totalIncome" }]}
            colors={[COLORS.RED, COLORS.GREEN]}
            width={500}
            height={300}
          />
        </Box>
      </ResponsiveContainer>
    </>
  );
}

export default Home;