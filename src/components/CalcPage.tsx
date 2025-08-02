"use client";

import "@aws-amplify/ui-react/styles.css";
import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import Additional from "./Additional";
import { AuthUser } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);
const client = generateClient<Schema>();

interface CalcPageProps {
  login: boolean;
  user: AuthUser | undefined;
  signOut?: () => void;
}

export default function CalcPage(props: CalcPageProps) {
  const router = useRouter();

  // 入力値の状態管理
  const [price, setPrice] = useState<number>(100);
  const [returnRate, setMarginRate] = useState<number>(0.5);
  const [baseSalary, setBaseSalary] = useState<number>(35);
  const [bonus, setBonus] = useState<number>(baseSalary * 4);

  function annualSalary() {
    return baseSalary * 10000 * 12 + bonus * 10000;
  }
  function averageMonthlySalary() {
    return annualSalary() / 12;
  }
  function monthlyGain() {
    return price * 10000 * returnRate;
  }
  function saveBonus() {
    return monthlyGain() * 4;
  }
  function monthlyNoBonus() {
    return (monthlyGain() * 8) / 12;
  }
  function totalAnnualGain() {
    return monthlyNoBonus() * 12 + saveBonus();
  }

  // 税金・保険料計算関数（月額ベース）
  function calculateMonthlyIncomeTax(monthlyIncome: number) {
    // 年収に換算して所得税を計算し、12で割る
    const annualIncome = monthlyIncome * 12;

    // 給与所得控除
    let deduction = 0;
    if (annualIncome <= 1625000) {
      deduction = 550000;
    } else if (annualIncome <= 1800000) {
      deduction = annualIncome * 0.4 - 100000;
    } else if (annualIncome <= 3600000) {
      deduction = annualIncome * 0.3 + 80000;
    } else if (annualIncome <= 6600000) {
      deduction = annualIncome * 0.2 + 440000;
    } else if (annualIncome <= 8500000) {
      deduction = annualIncome * 0.1 + 1100000;
    } else {
      deduction = 1950000;
    }

    // 基礎控除
    const basicDeduction = 480000;

    // 課税所得
    const taxableIncome = Math.max(
      0,
      annualIncome - deduction - basicDeduction
    );

    // 所得税計算（累進課税）
    let tax = 0;
    if (taxableIncome <= 1950000) {
      tax = taxableIncome * 0.05;
    } else if (taxableIncome <= 3300000) {
      tax = 97500 + (taxableIncome - 1950000) * 0.1;
    } else if (taxableIncome <= 6950000) {
      tax = 232500 + (taxableIncome - 3300000) * 0.2;
    } else if (taxableIncome <= 9000000) {
      tax = 962500 + (taxableIncome - 6950000) * 0.23;
    } else if (taxableIncome <= 18000000) {
      tax = 1434000 + (taxableIncome - 9000000) * 0.33;
    } else if (taxableIncome <= 40000000) {
      tax = 4404000 + (taxableIncome - 18000000) * 0.4;
    } else {
      tax = 13204000 + (taxableIncome - 40000000) * 0.45;
    }

    // 復興特別所得税（2.1%）を含めて月額に換算
    return (tax * 1.021) / 12;
  }

  function calculateMonthlyResidentTax(monthlyIncome: number) {
    // 年収に換算して住民税を計算し、12で割る
    const annualIncome = monthlyIncome * 12;

    // 給与所得控除（所得税と同じ）
    let deduction = 0;
    if (annualIncome <= 1625000) {
      deduction = 550000;
    } else if (annualIncome <= 1800000) {
      deduction = annualIncome * 0.4 - 100000;
    } else if (annualIncome <= 3600000) {
      deduction = annualIncome * 0.3 + 80000;
    } else if (annualIncome <= 6600000) {
      deduction = annualIncome * 0.2 + 440000;
    } else if (annualIncome <= 8500000) {
      deduction = annualIncome * 0.1 + 1100000;
    } else {
      deduction = 1950000;
    }

    // 基礎控除（住民税）
    const basicDeduction = 430000;

    // 課税所得
    const taxableIncome = Math.max(
      0,
      annualIncome - deduction - basicDeduction
    );

    // 所得割10% + 均等割5000円を月額に換算
    return (taxableIncome * 0.1 + 5000) / 12;
  }

  function calculateMonthlyHealthInsurance(monthlyIncome: number) {
    // 健康保険料率：約10%（労働者負担5%）
    // 標準報酬月額の上限：1,390,000円
    const cappedIncome = Math.min(monthlyIncome, 1390000);
    return cappedIncome * 0.05;
  }

  function calculateMonthlyPensionInsurance(monthlyIncome: number) {
    // 厚生年金保険料率：18.3%（労働者負担9.15%）
    // 標準報酬月額の上限：650,000円
    const cappedIncome = Math.min(monthlyIncome, 650000);
    return cappedIncome * 0.0915;
  }

  function calculateMonthlyEmploymentInsurance(monthlyIncome: number) {
    // 雇用保険料率：約0.6%（労働者負担0.3%）
    return monthlyIncome * 0.003;
  }

  // 手取り計算（個別関数に分解）
  function getNetAnnualIncome(monthlyIncome: number) {
    const monthlyIncomeTax = calculateMonthlyIncomeTax(monthlyIncome);
    const monthlyResidentTax = calculateMonthlyResidentTax(monthlyIncome);
    const monthlyHealthInsurance =
      calculateMonthlyHealthInsurance(monthlyIncome);
    const monthlyPensionInsurance =
      calculateMonthlyPensionInsurance(monthlyIncome);
    const monthlyEmploymentInsurance =
      calculateMonthlyEmploymentInsurance(monthlyIncome);

    const totalMonthlyDeductions =
      monthlyIncomeTax +
      monthlyResidentTax +
      monthlyHealthInsurance +
      monthlyPensionInsurance +
      monthlyEmploymentInsurance;
    const netMonthly = monthlyIncome - totalMonthlyDeductions;
    return netMonthly * 12;
  }

  function getNetMonthlyIncome(monthlyIncome: number) {
    const monthlyIncomeTax = calculateMonthlyIncomeTax(monthlyIncome);
    const monthlyResidentTax = calculateMonthlyResidentTax(monthlyIncome);
    const monthlyHealthInsurance =
      calculateMonthlyHealthInsurance(monthlyIncome);
    const monthlyPensionInsurance =
      calculateMonthlyPensionInsurance(monthlyIncome);
    const monthlyEmploymentInsurance =
      calculateMonthlyEmploymentInsurance(monthlyIncome);

    const totalMonthlyDeductions =
      monthlyIncomeTax +
      monthlyResidentTax +
      monthlyHealthInsurance +
      monthlyPensionInsurance +
      monthlyEmploymentInsurance;
    return monthlyIncome - totalMonthlyDeductions;
  }

  function getTotalMonthlyDeductions(monthlyIncome: number) {
    const monthlyIncomeTax = calculateMonthlyIncomeTax(monthlyIncome);
    const monthlyResidentTax = calculateMonthlyResidentTax(monthlyIncome);
    const monthlyHealthInsurance =
      calculateMonthlyHealthInsurance(monthlyIncome);
    const monthlyPensionInsurance =
      calculateMonthlyPensionInsurance(monthlyIncome);
    const monthlyEmploymentInsurance =
      calculateMonthlyEmploymentInsurance(monthlyIncome);

    return (
      monthlyIncomeTax +
      monthlyResidentTax +
      monthlyHealthInsurance +
      monthlyPensionInsurance +
      monthlyEmploymentInsurance
    );
  }

  function getTotalAnnualDeductions(monthlyIncome: number) {
    return getTotalMonthlyDeductions(monthlyIncome) * 12;
  }

  // 個別の税金・保険料取得関数
  function getMonthlyIncomeTax(monthlyIncome: number) {
    return calculateMonthlyIncomeTax(monthlyIncome);
  }

  function getMonthlyResidentTax(monthlyIncome: number) {
    return calculateMonthlyResidentTax(monthlyIncome);
  }

  function getMonthlyHealthInsurance(monthlyIncome: number) {
    return calculateMonthlyHealthInsurance(monthlyIncome);
  }

  function getMonthlyPensionInsurance(monthlyIncome: number) {
    return calculateMonthlyPensionInsurance(monthlyIncome);
  }

  function getMonthlyEmploymentInsurance(monthlyIncome: number) {
    return calculateMonthlyEmploymentInsurance(monthlyIncome);
  }

  // 年収差分計算関数
  function getAnnualDifference() {
    return Math.round(totalAnnualGain()) - annualSalary();
  }

  async function handleRegister(comment: string, nickname: string) {
    // バリデーション
    if (!nickname.trim()) {
      alert("ニックネームを入力してください");
      return;
    }

    // データベース保存用のデータ構造をスキーマに合わせて作成
    const salaryData = {
      unitPrice: price, // 万円を円に変換
      returnRate: returnRate,
      monthlySalary: baseSalary,
      bonus: bonus,
      annualSalary: annualSalary(),
      netAnnualSalary: Math.round(getNetAnnualIncome(averageMonthlySalary())),
      calcSalary: Math.round(totalAnnualGain()),
      calculatedAt: new Date().toISOString(),
      userId: props.user?.userId,
      nickname: nickname.trim(),
      comment: comment.trim() || null,
    };

    // AWS Amplify DataStoreに保存
    const { errors, data: SalaryCalculation } =
      await client.models.SalaryCalculation.create(salaryData, {
        authMode: "userPool",
      });
    console.log(SalaryCalculation);
    if (errors) {
      console.error("保存エラー:", errors);
    }
    router.push("/ranking");
  }

  function loginButton() {
    if (props.login) {
      return (
        <button
          onClick={props.signOut}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg ml-4"
        >
          ログアウト
        </button>
      );
    } else {
      return (
        <a
          href="/authed"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg ml-4"
        >
          ログイン
        </a>
      );
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            シンプルSES収入計算
          </h1>
          <div className="flex justify-center">
            <a
              href="https://github.com/ichir0roie/ses-price"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg"
            >
              GitHub Repository
            </a>
            <a
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg ml-4"
              href="/ranking"
            >
              ランキング
            </a>
            {loginButton()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b">
              入力
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  月額額面
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    万
                  </span>
                </div>
              </div>
              <div className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ">
                  ボーナス額面
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    万
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  単価
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    万
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  還元率
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={returnRate}
                  onChange={(e) => setMarginRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 ">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b">
              計算結果
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  月の手取り概算
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">所得税</span>
                    <span className="font-semibold text-red-500">
                      {Math.round(
                        getMonthlyIncomeTax(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">住民税</span>
                    <span className="font-semibold text-red-500">
                      {Math.round(
                        getMonthlyResidentTax(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">健康保険</span>
                    <span className="font-semibold text-red-500">
                      {Math.round(
                        getMonthlyHealthInsurance(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">厚生年金</span>
                    <span className="font-semibold text-red-500">
                      {Math.round(
                        getMonthlyPensionInsurance(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">雇用保険</span>
                    <span className="font-semibold text-red-500">
                      {Math.round(
                        getMonthlyEmploymentInsurance(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">
                      月額控除合計
                    </span>
                    <span className="font-bold text-red-600">
                      {Math.round(
                        getTotalMonthlyDeductions(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">
                      手取り月収
                    </span>
                    <span className="font-bold text-green-600">
                      {Math.round(
                        getNetMonthlyIncome(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  理論値の額面
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">額面</span>
                    <span className="font-semibold">
                      {Math.round(monthlyGain()).toLocaleString()}円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ボーナス積立(4ヶ月分)</span>
                    <span className="font-semibold">
                      {Math.round(saveBonus()).toLocaleString()}円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ボーナス無し額面</span>
                    <span className="font-semibold">
                      {Math.round(monthlyNoBonus()).toLocaleString()}円
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  年収比較
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">実際の年収</span>
                    <span className="font-semibold">
                      {annualSalary().toLocaleString()}円
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">手取り年収</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(
                        getNetAnnualIncome(averageMonthlySalary())
                      ).toLocaleString()}
                      円
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>年間控除合計</span>
                    <span>
                      {Math.round(
                        getTotalAnnualDeductions(averageMonthlySalary())
                      ).toLocaleString()}
                      円/年
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">計算年収</span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(totalAnnualGain()).toLocaleString()}円
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">
                        年収差分
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          getAnnualDifference() < 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getAnnualDifference() >= 0 ? "-" : ""}
                        {getAnnualDifference().toLocaleString()}円
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>計算年収 - 実際の年収</span>
                      <span>
                        {(
                          (Math.abs(getAnnualDifference()) / annualSalary()) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {props.login ? <Additional handleRegister={handleRegister} /> : <div />}
      </div>
    </div>
  );
}
