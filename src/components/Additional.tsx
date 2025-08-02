import CalcPage from "@/components/CalcPage";
import router from "next/router";
import { JSX, useState } from "react";

interface AdditionalProps {
  handleRegister: CallableFunction;
}

export default function Additional(props: AdditionalProps) {
  const [nickname, setNickname] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  function handleRegister() {
    props.handleRegister(nickname, comment);
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b">
          コメント・登録
        </h2>
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ニックネーム
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="お名前やニックネームを入力"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            コメント
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="この計算に関するメモやコメントがあれば入力してください"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRegister}
            className="bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            計算結果を登録
          </button>
        </div>
      </div>
    </div>
  );
}
