import { dbConnect } from "@/lib/db/connect";
import Donation from "@/lib/models/Donation";
import Donor from "@/lib/models/Donor";
import Bank from "@/lib/models/Bank";
import Voucher from "@/lib/models/Voucher";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type"); // financial, donor, bank, yearly, donation-count, etc.
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const period = searchParams.get("period"); // month, quarter, year

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date("2020-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    let report = {};

    if (reportType === "financial-donor-name") {
      // Financial report by donor name
      report = await generateDonorFinancialReport(start, end);
    } else if (reportType === "bank-balance") {
      // Bank deposit current balance report
      report = await generateBankBalanceReport();
    } else if (reportType === "yearly") {
      // Yearly donation report
      report = await generateYearlyReport();
    } else if (reportType === "donation-count") {
      // How many donations received
      report = await generateDonationCountReport(start, end);
    } else if (reportType === "donor-amount-period") {
      // Donor amount by month/quarter/year wise
      report = await generateDonorAmountByPeriodReport(start, end, period);
    } else if (reportType === "bank-entry") {
      // Bank entry report
      report = await generateBankEntryReport(start, end);
    } else if (reportType === "check-issued") {
      // Check issued report
      report = await generateCheckIssuedReport(start, end);
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function generateDonorFinancialReport(startDate, endDate) {
  const donations = await Donation.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$donor",
        totalAmount: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        lastDonation: { $max: "$date" },
      },
    },
    {
      $lookup: {
        from: "donors",
        localField: "_id",
        foreignField: "_id",
        as: "donorInfo",
      },
    },
    {
      $unwind: "$donorInfo",
    },
    {
      $project: {
        donorName: "$donorInfo.name",
        donorEmail: "$donorInfo.email",
        totalAmount: 1,
        donationCount: 1,
        lastDonation: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  return {
    type: "financial-donor-name",
    startDate,
    endDate,
    totalDonors: donations.length,
    totalAmount: donations.reduce((sum, d) => sum + d.totalAmount, 0),
    donations,
  };
}

async function generateBankBalanceReport() {
  const banks = await Bank.find();
  const bankBalances = await Promise.all(
    banks.map(async (bank) => {
      const openingBalance = await Voucher.aggregate([
        {
          $match: {
            bankCode: bank.code,
          },
        },
        {
          $group: {
            _id: null,
            totalDebit: {
              $sum: {
                $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
              },
            },
            totalCredit: {
              $sum: {
                $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
              },
            },
          },
        },
      ]);

      const balance =
        (openingBalance[0]?.totalCredit || 0) -
        (openingBalance[0]?.totalDebit || 0);

      return {
        bankName: bank.name,
        bankCode: bank.code,
        currentBalance: balance,
        totalDebit: openingBalance[0]?.totalDebit || 0,
        totalCredit: openingBalance[0]?.totalCredit || 0,
      };
    })
  );

  return {
    type: "bank-balance",
    generatedDate: new Date(),
    banks: bankBalances,
    totalBalance: bankBalances.reduce((sum, b) => sum + b.currentBalance, 0),
  };
}

async function generateYearlyReport() {
  const yearlyData = await Donation.aggregate([
    {
      $group: {
        _id: { $year: "$date" },
        totalAmount: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        byMode: {
          $push: {
            mode: "$mode",
            amount: "$amount",
          },
        },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);

  return {
    type: "yearly",
    generatedDate: new Date(),
    data: yearlyData,
  };
}

async function generateDonationCountReport(startDate, endDate) {
  const totalDonations = await Donation.countDocuments({
    date: { $gte: startDate, $lte: endDate },
  });

  const byMode = await Donation.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$mode",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const byProgram = await Donation.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$program",
        count: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  return {
    type: "donation-count",
    startDate,
    endDate,
    totalDonations,
    byMode,
    byProgram,
  };
}

async function generateDonorAmountByPeriodReport(startDate, endDate, period = "month") {
  let groupBy;
  if (period === "month") {
    groupBy = {
      $dateToString: { format: "%Y-%m", date: "$date" },
    };
  } else if (period === "quarter") {
    groupBy = {
      $dateToString: { format: "%Y-Q%q", date: "$date" },
    };
  } else {
    groupBy = {
      $year: "$date",
    };
  }

  const periodData = await Donation.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: groupBy,
        totalAmount: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        uniqueDonors: { $addToSet: "$donor" },
      },
    },
    {
      $project: {
        _id: 1,
        totalAmount: 1,
        donationCount: 1,
        uniqueDonorCount: { $size: "$uniqueDonors" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    type: "donor-amount-period",
    period,
    startDate,
    endDate,
    data: periodData,
    totalAmount: periodData.reduce((sum, d) => sum + d.totalAmount, 0),
  };
}

async function generateBankEntryReport(startDate, endDate) {
  const bankEntries = await Voucher.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: "banks",
        localField: "bankCode",
        foreignField: "code",
        as: "bankInfo",
      },
    },
    {
      $unwind: {
        path: "$bankInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$bankCode",
        bankName: { $first: "$bankInfo.name" },
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
          },
        },
        entries: { $sum: 1 },
      },
    },
    {
      $sort: { entries: -1 },
    },
  ]);

  return {
    type: "bank-entry",
    startDate,
    endDate,
    generatedDate: new Date(),
    bankEntries,
    summary: {
      totalBanks: bankEntries.length,
      totalDebit: bankEntries.reduce((sum, b) => sum + b.totalDebit, 0),
      totalCredit: bankEntries.reduce((sum, b) => sum + b.totalCredit, 0),
      totalEntries: bankEntries.reduce((sum, b) => sum + b.entries, 0),
    },
  };
}

async function generateCheckIssuedReport(startDate, endDate) {
  const checkVouchers = await Voucher.aggregate([
    {
      $match: {
        mode: "cheque",
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: "parties",
        localField: "partyCode",
        foreignField: "code",
        as: "partyInfo",
      },
    },
    {
      $unwind: {
        path: "$partyInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        voucherNo: 1,
        amount: 1,
        date: 1,
        partyName: "$partyInfo.name",
        referenceNo: 1,
        status: 1,
      },
    },
    {
      $sort: { date: -1 },
    },
  ]);

  return {
    type: "check-issued",
    startDate,
    endDate,
    generatedDate: new Date(),
    totalChecks: checkVouchers.length,
    totalAmount: checkVouchers.reduce((sum, c) => sum + c.amount, 0),
    checks: checkVouchers,
  };
}
