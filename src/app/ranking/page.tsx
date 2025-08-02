"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Schema } from "../../../amplify/data/resource";
import outputs from "../../../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

type dataType = Schema["SalaryCalculation"]["type"];

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function RankingPage() {
  const router = useRouter();
  const [rankingData, setRankingData] = useState<dataType[]>([]);

  const handleDelete = async (id: string) => {
    const { data: deleted, errors } =
      await client.models.SalaryCalculation.delete(
        { id: id },
        { authMode: "userPool" }
      );
    if (errors) {
      console.error("削除エラー:", errors);
    } else {
      console.log("削除成功:", deleted);
    }
    fetchRankingData();
  };

  async function fetchRankingData() {
    // AWS Amplify DataStoreからデータを取得（annualSalaryの大きい順）
    const { data: salary } = await client.models.SalaryCalculation.list({
      limit: 100, // 最大100件
      authMode: "userPool",
    });

    console.log("取得データ:", salary);

    // annualSalaryの降順でソート dynamo db でソート機能が本当に見つからない。どうやってんの？
    const sortedSalary = salary.sort((a, b) => b.annualSalary - a.annualSalary);
    setRankingData(sortedSalary);
  }
  useEffect(() => {
    fetchRankingData();
  }, []);

  const handleBackToCalculator = () => {
    router.push("/authed");
  };

  return (
    <Authenticator>
      {({ user }) => (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                SES収入記録
              </h1>
              <button
                onClick={handleBackToCalculator}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                ← 計算に戻る
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        順位
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ニックネーム
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価/還元率
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        計算年収
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        実際の年収
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        年収差分
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        コメント
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rankingData.map((data, index) => (
                      <tr
                        key={data.id}
                        className={index < 3 ? "bg-yellow-50" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`text-lg font-bold ${
                                index === 0
                                  ? "text-yellow-500"
                                  : index === 1
                                    ? "text-gray-400"
                                    : index === 2
                                      ? "text-amber-600"
                                      : "text-gray-600"
                              }`}
                            >
                              {`${index + 1}位`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {data.nickname || "匿名ユーザー"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {data.unitPrice}
                            万円
                          </div>
                          <div className="text-sm text-gray-500">
                            還元率: {data.returnRate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {Number.parseInt(
                              (data.calcSalary / 10000).toString()
                            )}
                            万円
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {Number.parseInt(
                              (data.annualSalary / 10000).toString()
                            )}
                            万円
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-red-600">
                            {Number.parseInt(
                              (
                                (data.calcSalary - data.annualSalary) /
                                10000
                              ).toString()
                            )}
                            万円
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(data.calculatedAt).toLocaleDateString(
                              "ja-JP"
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {data.comment || "コメントなし"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {data.owner === user?.userId && (
                            <button
                              onClick={() => handleDelete(data.id)}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                              削除
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {rankingData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  まだランキングデータがありません
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  計算結果を登録すると、ここに表示されます
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Authenticator>
  );
}
