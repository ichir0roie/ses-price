"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // 入力値の状態管理
  const [price, setPrice] = useState<number>(100);
  const [marginRate, setMarginRate] = useState<number>(0.5);
  const [baseSalary, setBaseSalary] = useState<number>(35);
  const [bonus, setBonus] = useState<number>(baseSalary * 4);

  // 計算結果の状態管理
  const [results, setResults] = useState<{
    annualSalary: number;
    averageMonthlySalary: number;
    monthlyGain: number;
    saveBonus: number;
    monthlyNoBonus: number;
    totalAnnualGain: number;
  }>({
    annualSalary: 0,
    averageMonthlySalary: 0,
    monthlyGain: 0,
    saveBonus: 0,
    monthlyNoBonus: 0,
    totalAnnualGain: 0,
  });

  // 計算を実行する関数
  const calculate = () => {
    // 年収計算
    const annualSalary = baseSalary * 10000 * 12 + bonus * 10000;
    const averageMonthlySalary = annualSalary / 12;

    // 利益計算
    const monthlyGain = price * 10000 * marginRate;
    const saveBonus = monthlyGain * 4;
    const monthlyNoBonus = (monthlyGain * 8) / 12;
    const totalAnnualGain = monthlyNoBonus * 12 + saveBonus;

    setResults({
      annualSalary,
      averageMonthlySalary,
      monthlyGain,
      saveBonus,
      monthlyNoBonus,
      totalAnnualGain,
    });
  };

  useEffect(() => {
    calculate();
  }, [price, marginRate, baseSalary, bonus]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          シンプルSES収入計算
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">入力</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ボーナス
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
                  マージン率
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={marginRate}
                  onChange={(e) => setMarginRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 結果表示 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              計算結果
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  実際の収入
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">実際の年収:</span>
                    <span className="font-semibold">
                      {results.annualSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">平均月収:</span>
                    <span className="font-semibold">
                      {Math.round(
                        results.averageMonthlySalary
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  理論値の収入
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">月収:</span>
                    <span className="font-semibold">
                      {Math.round(results.monthlyGain).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ボーナス積立:</span>
                    <span className="font-semibold">
                      {Math.round(results.saveBonus).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ボーナス無し月収:</span>
                    <span className="font-semibold">
                      {Math.round(results.monthlyNoBonus).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-800 font-medium">計算年収:</span>
                  <span className="font-bold text-blue-600">
                    {Math.round(results.totalAnnualGain).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
